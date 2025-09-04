export function getSoundForTitle(title?: string): string | undefined {
  if (!title) return undefined;
  const t = title.toLowerCase();
  if (t.includes("sauce & spoon") || t.includes("sauce and spoon")) return "/assets/fitgirl-repack-tune.mp3";
  if (t.includes("game development")) return "/assets/psx.mp3";
  if (t.includes("video production excellence")) return "/assets/keyboard-rage.mp3";
  if (t.includes("social media strategy")) return "/assets/simps.mp3";
  if (t.includes("game marketing")) return "/assets/intro-spongebob-bob.mp3";
  if (t.includes("office green")) return "/assets/the-office-theme-song.mp3";
  if (t.includes("fire & spark") || t.includes("fire and spark")) return "/assets/fire-burning.mp3";
  if (t.includes("google project management")) return "/assets/ok-google.mp3";
  if (t.includes("mckinsey")) return "/assets/thats-not-on-the-birth-certificate-zoe.mp3";
  if (t.includes("game & app academy") || t.includes("game and app academy")) return "/assets/ron-swanson-Throw-Computer-in-Trash-Meme.mp3";
  if (t.includes("about me")) return "/assets/Resume.mp3";
  return undefined;
}

export const PROJECTS_HERO_SOUND = "/assets/Friends-Theme-Song.mp3";
