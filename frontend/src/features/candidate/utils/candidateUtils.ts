/**
 * Checks whether the image source URL is empty or uses a standard placehold.co placeholder
 */
export function isPlaceholderImage(imageUrl?: string): boolean {
    if (!imageUrl) return true;
    return imageUrl.includes('placehold.co');
}
