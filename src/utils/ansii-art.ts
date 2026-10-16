import figlet from "figlet";
import ansiColors from "ansi-colors";

export default async function signature() {
  const text = await figlet.text("Vendor CLI");
  console.log(ansiColors.cyan(text));
}
