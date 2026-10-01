export function obterClassiIndicativa(valor) {
  switch (String(valor)) {
    case "L": return "logoLivre";
    case "10": return "logo10";
    case "12": return "logo12";
    case "14": return "logo14";
    case "16": return "logo16";
    case "18": return "logo18";

    default: return "";
  }
}