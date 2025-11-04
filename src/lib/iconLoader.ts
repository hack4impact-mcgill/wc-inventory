// Dynamically import all icons from /public/category_icons
export const iconFiles = import.meta.glob("/src/assets/category_icons/*.svg", {
    eager: true,
    query: "url",
    import: "default",
  });

  export function getCategoryIconPath(iconName: string | null): string {
    if (!iconName) return "/src/assets/category_icons/Folder.svg";
    const normalized = iconName.toLowerCase();
  
    for (const key of Object.keys(iconFiles)) {
      const lowerKey = key.toLowerCase(); 
      if (lowerKey.endsWith(`${normalized}.svg`)) {
        return (iconFiles as Record<string, string>)[key];
      }
    }
  
    return "/src/assets/category_icons/Folder.svg";
  }
  
  /**
   * Returns a list of all available icon names (without .svg)
   */
  export function getAvailableIconNames(): string[] {
    return Object.keys(iconFiles).map((key) =>
      key.split("/").pop()!.replace(".svg", "")
    );
  }
  