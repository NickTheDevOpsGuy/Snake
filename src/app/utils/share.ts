export async function shareScore(
  score: number,
  difficulty: string,
  best: number,
): Promise<boolean> {
  const text = `I scored ${score} in Snake (${difficulty})! 🐍 My best: ${best}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Snake Score",
        text,
      });
      return true;
    } catch {
      return copyToClipboard(text);
    }
  }
  return copyToClipboard(text);
}

function copyToClipboard(text: string): boolean {
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
