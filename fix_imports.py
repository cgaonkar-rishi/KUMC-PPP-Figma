import os
import re

root_dir = r"c:\Projects\KUMC\Figma_NextJs_Code\KUMC-PPP-Dev-Version\src"
exclude_dirs = {"node_modules", ".next"}

# Regex to find @version before end of string in import
# Matches @ followed by digits/dots if they are followed by ' or "
pattern = re.compile(r"(@\d+(\.\d+)*)(?=['\"])")

def fix_imports():
    for root, dirs, files in os.walk(root_dir):
        # Exclude specific directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = pattern.sub('', content)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed imports in: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    fix_imports()
