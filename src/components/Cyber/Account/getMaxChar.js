
export function getMaxChar(label) {
  if (label === "username") return 15;
  else if (label === "display name") return 20;
  else if (label === "bio") return 300;
}