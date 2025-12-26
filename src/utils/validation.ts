/**
 * Validates if a string is a valid GitHub repository URL
 * @param url - The URL to validate
 * @returns true if valid GitHub repo URL, false otherwise
 */
export const isValidGitHubUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;

  try {
    const urlObj = new URL(url.trim());

    // Check if it's a GitHub URL
    if (urlObj.hostname !== 'github.com') return false;

    // GitHub repo URLs follow pattern: https://github.com/username/repo
    // Pathname should be /username/repo or /username/repo/
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);

    // Should have exactly 2 parts: username and repo
    if (pathParts.length < 2) return false;

    // Username and repo name should not be empty and should contain valid characters
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    const repoRegex = /^[a-zA-Z0-9._-]+$/;

    return usernameRegex.test(pathParts[0]) && repoRegex.test(pathParts[1]);
  } catch (error) {
    return false;
  }
};

/**
 * Extracts repository information from a GitHub URL
 * @param url - The GitHub URL
 * @returns Object with username and repo name, or null if invalid
 */
export const parseGitHubUrl = (url: string): { username: string; repo: string } | null => {
  if (!isValidGitHubUrl(url)) return null;

  try {
    const urlObj = new URL(url.trim());
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);

    return {
      username: pathParts[0],
      repo: pathParts[1],
    };
  } catch (error) {
    return null;
  }
};
