import ctypes
from ctypes import wintypes
import zipfile
import xml.etree.ElementTree as ET
import json
import io

GENERIC_READ = 0x80000000
FILE_SHARE_READ = 0x00000001
FILE_SHARE_WRITE = 0x00000002
FILE_SHARE_DELETE = 0x00000004
OPEN_EXISTING = 3
FILE_ATTRIBUTE_NORMAL = 0x80
INVALID_HANDLE_VALUE = -1

kernel32 = ctypes.windll.kernel32

filename = r"prix d'achats des produits.xlsx"

handle = kernel32.CreateFileW(
    filename,
    GENERIC_READ,
    FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
    None,
    OPEN_EXISTING,
    FILE_ATTRIBUTE_NORMAL,
    None
)

if handle == INVALID_HANDLE_VALUE:
    error_code = kernel32.GetLastError()
    print(f"Failed to open file, error code: {error_code}")
    exit(1)

# Get file size
file_size_high = wintypes.DWORD()
file_size_low = kernel32.GetFileSize(handle, ctypes.byref(file_size_high))
file_size = (file_size_high.value << 32) + file_size_low
print(f"File opened successfully! Size: {file_size} bytes")

# Read file contents
buffer = ctypes.create_string_buffer(file_size)
bytes_read = wintypes.DWORD()

success = kernel32.ReadFile(
    handle,
    buffer,
    file_size,
    ctypes.byref(bytes_read),
    None
)

kernel32.CloseHandle(handle)

if not success:
    print("Failed to read file")
    exit(1)

raw_bytes = buffer.raw[:bytes_read.value]
print(f"Read {len(raw_bytes)} bytes successfully!")

# Parse zip from bytes in memory
file_bytes_io = io.BytesIO(raw_bytes)
with zipfile.ZipFile(file_bytes_io, 'r') as z:
    print("Zip contents:", z.namelist())
    
    # Read shared strings
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
            if t is not None and t.text:
                shared_strings.append(t.text)
            else:
                r_texts = [r.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t').text for r in si.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}r') if r.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') is not None and r.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t').text]
                shared_strings.append(''.join(r_texts))
                
    # Read sheet1.xml
    sheet_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    rows = sheet_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
    
    parsed_rows = []
    for r in rows:
        row_data = []
        for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            t_attr = c.get('t')
            v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            val = v.text if v is not None else ''
            if t_attr == 's' and val.isdigit():
                val = shared_strings[int(val)]
            row_data.append(val)
        parsed_rows.append(row_data)
        
    print(f"\nTOTAL ROWS IN EXCEL: {len(parsed_rows)}")
    for i, r in enumerate(parsed_rows):
        print(f"Row {i:2d}: {r}")

    with open('scripts/excel_purchase_prices.json', 'w', encoding='utf-8') as f_out:
        json.dump(parsed_rows, f_out, ensure_ascii=False, indent=2)
    print("\nSaved extracted data to scripts/excel_purchase_prices.json")
