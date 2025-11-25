import { iconApi, CategoryIcon } from "./api/icon";

// in-mem cache of all category icons as their data
let iconCache: CategoryIcon[] | null = null;


export async function getAllIcons(): Promise<CategoryIcon[]> {

  if (iconCache) {

    refreshCache();
    return iconCache;
  }


  const icons = await iconApi.getIcons();
  iconCache = icons;
  return icons;
}
export function getIconCache() {
  return iconCache;
}
async function refreshCache() {
  try {
    const latest = await iconApi.getIcons();
    iconCache = latest;
  } catch (error) {
    console.error("Failed to refresh icon cache:", error);
  }
}

export async function getSpecificIcon(name: string): Promise<CategoryIcon | null> {
  const normalized = name.toLowerCase();


  if (iconCache) {
    const match = iconCache.find(
      (icon) => icon.name.toLowerCase() === normalized
    );

    refreshCache();
    return match || null;
  }

  const icons = await iconApi.getIcons();
  iconCache = icons;
  const match = icons.find((icon) => icon.name.toLowerCase() === normalized);
  return match || null;
}


export async function uploadIcon(
  file: File,
  name: string,
  uploadedBy: string | null = null
): Promise<CategoryIcon> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async (ev) => {
      try {
        const result = ev.target?.result as string;
        if (!result) throw new Error("Failed to read file");

        const newIcon = await iconApi.createIcon({
          name,
          data: result,
          mime_type: file.type,
          uploaded_by: uploadedBy,
        });

        // Update cache immediately
        if (iconCache) iconCache.push(newIcon);
        else iconCache = [newIcon];

        resolve(newIcon);


        refreshCache();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function renameIcon(
  iconId: string,
  newName: string
): Promise<CategoryIcon> {
  const updated = await iconApi.updateIcon(iconId, { name: newName });


  if (iconCache) {
    const idx = iconCache.findIndex((i) => i.icon_id === iconId);
    if (idx !== -1) iconCache[idx] = updated;
  }


  refreshCache();
  return updated;
}


export async function deleteIcon(iconId: string): Promise<void> {
  await iconApi.deleteIcon(iconId);


  if (iconCache) {
    iconCache = iconCache.filter((i) => i.icon_id !== iconId);
  }

  refreshCache();
}