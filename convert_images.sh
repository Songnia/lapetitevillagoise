#!/bin/bash

# Ce script convertit toutes les images (PNG, JPG, JPEG) en WebP dans le dossier spécifié (et ses sous-dossiers).

# Vérifier si cwebp est installé
if ! command -v cwebp &> /dev/null; then
    echo "L'outil 'cwebp' n'est pas installé."
    echo "Vous pouvez l'installer avec la commande : sudo apt-get install webp"
    exit 1
fi

# Qualité de l'image (0-100)
QUALITY=80

# Dossier à analyser (défaut : dossier courant si aucun paramètre n'est passé)
TARGET_DIR="${1:-.}"

echo "Recherche d'images dans $TARGET_DIR..."

# Trouver les fichiers avec les extensions souhaitées (insensible à la casse)
find "$TARGET_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0 | while IFS= read -r -d '' file; do
    
    # Extraire le chemin, le nom du fichier et retirer l'ancienne extension
    dir=$(dirname "$file")
    filename=$(basename "$file")
    name="${filename%.*}"
    
    # Chemin du nouveau fichier WebP
    webp_file="${dir}/${name}.webp"
    
    # Convertir seulement si le fichier WebP n'existe pas déjà
    if [ ! -f "$webp_file" ]; then
        echo "Conversion de : $file"
        cwebp -q $QUALITY "$file" -o "$webp_file" -quiet
        
        # Optionnel : Décommentez la ligne suivante pour supprimer l'image originale après conversion
        # rm "$file"
    else
        echo "Ignoré (existe déjà) : $webp_file"
    fi

done

echo "Terminé !"
