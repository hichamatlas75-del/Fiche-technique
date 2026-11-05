import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

workspace_dir = r'c:\Users\mplp000\OneDrive\Dokumente\GitHub\Fiche-technique'
assets_dir = os.path.join(workspace_dir, 'assets_presentation')
os.makedirs(assets_dir, exist_ok=True)

# -----------------------------------------------------------------------------
# 1. GENERATE HIGH QUALITY CHARTS WITH MATPLOTLIB
# -----------------------------------------------------------------------------

# Diagram 1: Menu Engineering Matrix
def generate_menu_engineering_chart():
    fig, ax = plt.subplots(figsize=(7, 5), dpi=300)
    fig.patch.set_facecolor('#0F172A')
    ax.set_facecolor('#1E293B')

    # Quadrants
    ax.fill_between([0, 5], 5, 10, color='#F59E0B', alpha=0.15)
    ax.fill_between([5, 10], 5, 10, color='#10B981', alpha=0.18)
    ax.fill_between([0, 5], 0, 5, color='#EF4444', alpha=0.15)
    ax.fill_between([5, 10], 0, 5, color='#3B82F6', alpha=0.15)

    ax.axhline(5, color='#94A3B8', linestyle='--', linewidth=1.5, alpha=0.7)
    ax.axvline(5, color='#94A3B8', linestyle='--', linewidth=1.5, alpha=0.7)

    # Quadrant Texts
    ax.text(2.5, 7.8, "PUZZLES\n(Faible Vente / Forte Marge)", color='#FBBF24',
            fontsize=12, fontweight='bold', ha='center', va='center')
    ax.text(2.5, 6.2, "Action : Repositionner la carte,\nstorytelling, challenge serveurs",
            color='#E2E8F0', fontsize=9, ha='center', va='center')

    ax.text(7.5, 7.8, "ÉTOILES (STARS)\n(Forte Vente / Forte Marge)", color='#34D399',
            fontsize=12, fontweight='bold', ha='center', va='center')
    ax.text(7.5, 6.2, "Action : Sanctuariser la recette,\nzone chaude du menu, suggestion",
            color='#E2E8F0', fontsize=9, ha='center', va='center')

    ax.text(2.5, 3.2, "CHIENS (DOGS)\n(Faible Vente / Faible Marge)", color='#F87171',
            fontsize=12, fontweight='bold', ha='center', va='center')
    ax.text(2.5, 1.8, "Action : Retirer de la carte,\néliminer les stocks morts",
            color='#E2E8F0', fontsize=9, ha='center', va='center')

    ax.text(7.5, 3.2, "VACHES À LAIT\n(Forte Vente / Faible Marge)", color='#60A5FA',
            fontsize=12, fontweight='bold', ha='center', va='center')
    ax.text(7.5, 1.8, "Action : Ajuster grammage (-10g),\nlégère hausse de prix (+2 à +5 DH)",
            color='#E2E8F0', fontsize=9, ha='center', va='center')

    dishes = [
        (8.2, 8.5, "Émincé Poulet", '#34D399'),
        (7.2, 7.8, "Pavé Saumon", '#34D399'),
        (8.8, 3.6, "Couscous Poulet", '#60A5FA'),
        (7.9, 2.8, "Panini Mix", '#60A5FA'),
        (2.8, 8.2, "Salade Burrata", '#FBBF24'),
        (3.5, 7.1, "Pizza Truffe", '#FBBF24'),
        (1.8, 2.2, "Plat Rumsteak", '#F87171'),
        (2.2, 3.1, "Wrap Dinde", '#F87171'),
    ]

    for x, y, name, col in dishes:
        ax.scatter(x, y, color=col, s=120, edgecolors='white', linewidth=1.5, zorder=5)
        ax.text(x, y - 0.45, name, color='white', fontsize=8, ha='center', fontweight='bold', zorder=6)

    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.set_xlabel("POPULARITÉ (Volume des Ventes Vendues) ➔", color='#94A3B8', fontsize=10, fontweight='bold')
    ax.set_ylabel("RENTABILITÉ (Marge Brute en Valeur DH) ➔", color='#94A3B8', fontsize=10, fontweight='bold')
    ax.set_title("MATRICE MENU ENGINEERING (Kasavana & Smith)", color='#F8FAFC', fontsize=13, fontweight='bold', pad=15)

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#475569')
    ax.spines['bottom'].set_color('#475569')
    ax.set_xticks([])
    ax.set_yticks([])

    plt.tight_layout()
    path = os.path.join(assets_dir, 'menu_engineering_matrix.png')
    plt.savefig(path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    return path

# Diagram 2: Waterfall / Price Breakdown
def generate_waterfall_chart():
    fig, ax = plt.subplots(figsize=(6.5, 3.8), dpi=300)
    fig.patch.set_facecolor('#0F172A')
    ax.set_facecolor('#1E293B')

    categories = ['Prix Vente TTC', 'TVA (10%)', 'Prix Vente HT', 'Coût Matière\n(Food Cost)', 'Marge Brute\n(Gains Nets)']
    values = [100, 9.1, 90.9, 27.3, 63.6]
    colors = ['#38BDF8', '#94A3B8', '#F59E0B', '#EF4444', '#10B981']

    x = np.arange(len(categories))
    bars = ax.bar(x, values, color=colors, width=0.55, edgecolor='white', linewidth=1)

    labels = ['100 DH (100%)', '-9.1 DH (TVA)', '90.9 DH (Base HT)', '-27.3 DH (30% FC)', '63.6 DH (70% Marge)']
    for bar, label in zip(bars, labels):
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2.0, yval + 2, label, ha='center', va='bottom', color='white', fontsize=8.5, fontweight='bold')

    ax.set_ylim(0, 120)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, color='#E2E8F0', fontsize=9, fontweight='bold')
    ax.set_yticks([])
    ax.set_title("ANATOMIE FINANCIÈRE D'UN PLAT VENDU", color='#F8FAFC', fontsize=12, fontweight='bold', pad=15)

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_color('#475569')

    plt.tight_layout()
    path = os.path.join(assets_dir, 'waterfall_foodcost.png')
    plt.savefig(path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    return path

# Diagram 3: Category Food Cost Targets Chart
def generate_category_targets_chart():
    fig, ax = plt.subplots(figsize=(6.5, 3.8), dpi=300)
    fig.patch.set_facecolor('#0F172A')
    ax.set_facecolor('#1E293B')

    cats = ['Boissons Chaudes', 'Pizzas & Pâtes', 'Desserts', 'Burgers & Wraps', 'Plats Viandes / Poissons']
    fc_targets = [12, 18, 20, 25, 32]
    colors = ['#10B981', '#34D399', '#38BDF8', '#F59E0B', '#F87171']

    y_pos = np.arange(len(cats))
    bars = ax.barh(y_pos, fc_targets, color=colors, height=0.5, edgecolor='white', linewidth=1)

    for bar, val in zip(bars, fc_targets):
        ax.text(val + 1, bar.get_y() + bar.get_height()/2.0, f"{val}% FC Cible", va='center', color='white', fontsize=9, fontweight='bold')

    ax.set_yticks(y_pos)
    ax.set_yticklabels(cats, color='#E2E8F0', fontsize=9.5, fontweight='bold')
    ax.set_xlim(0, 42)
    ax.set_xlabel("Ratio Food Cost Cible (%) ➔", color='#94A3B8', fontsize=9, fontweight='bold')
    ax.set_title("BENCHMARKS FOOD COST PAR FAMILLE DE PLATS", color='#F8FAFC', fontsize=12, fontweight='bold', pad=15)

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#475569')
    ax.spines['bottom'].set_color('#475569')
    ax.tick_params(colors='#64748B', which='both')

    plt.tight_layout()
    path = os.path.join(assets_dir, 'category_targets.png')
    plt.savefig(path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    return path

if __name__ == '__main__':
    print("Generating illustrated charts...")
    chart_matrix = generate_menu_engineering_chart()
    chart_waterfall = generate_waterfall_chart()
    chart_targets = generate_category_targets_chart()
    print("All charts generated in:", assets_dir)
