// Copy and label data for the /whats-inside page. Every fact here comes from
// the Brewy Guilt Free Cola label (public/labels/brewy.png).

export type StopIcon =
  | "sugar"
  | "calories"
  | "caffeine"
  | "prebiotics"
  | "fiber"
  | "aspartame"
  | "nutrition"
  | "ingredients";

export type TourStop = {
  title: string;
  // "out" = something we left out (shown struck through), "in" = something we put in
  tag_type: "out" | "in";
  tag: string;
  body: string;
  icon: StopIcon;
  /** Centre of this spot on the label artwork, as fractions of its width and
   *  height (0,0 = top-left). The bottle turns this spot to the camera. */
  label_position: [number, number];
  /** Spotlight half-size as a fraction of the label's height. */
  spot?: [number, number];
  /** Camera distance for this stop; bigger spots need to pull back. */
  distance?: number;
  /** Extra panel shown under the copy. */
  panel?: "nutrition" | "ingredients";
};

export const podium = {
  eyebrow: "Nothing to hide",
  name: "Guilt Free Cola",
  // How the name is set on the pedestal's front face.
  pedestal: ["Guilt Free", "Cola"],
  details: ["300 ml", "Carbonated water", "0g sugar"],
  hint: "Scroll to discover",
};

// The close-up that opens the tour, as the bottle takes the spotlight.
export const hero = {
  title: "Guilt Free Cola",
  body: "The cola they said couldn't exist. Same taste, smarter formula: zero sugar, just 16 kcal per 100 ml and a 3-plant prebiotic blend.",
};

export const tour: TourStop[] = [
  {
    title: "Zero Sugar",
    tag_type: "out",
    tag: "Added sugar",
    body: "Sweetened with plant-based Stevia & Erythritol, so you get the full cola hit with 0g sugar in every bottle.",
    icon: "sugar",
    label_position: [0.1294, 0.3431],
  },
  {
    title: "Low Calories",
    tag_type: "in",
    tag: "16 kcal / 100 ml",
    body: "Light on your body. The fizz stays in, the guilt stays out!",
    icon: "calories",
    label_position: [0.192, 0.3431],
  },
  {
    title: "No Caffeine",
    tag_type: "out",
    tag: "Caffeine",
    body: "Enjoy it anytime, morning or midnight. No jitters. No crash.",
    icon: "caffeine",
    label_position: [0.2547, 0.3431],
  },
  {
    title: "Gut-Loving Prebiotics",
    tag_type: "in",
    tag: "3-plant blend",
    body: "Wheat dextrin, FOS & inulin: a 3-plant prebiotic blend to help you feel good inside.",
    icon: "prebiotics",
    label_position: [0.1294, 0.5598],
  },
  {
    title: "Dietary Fiber",
    tag_type: "in",
    tag: "4g+ per bottle",
    body: "Real, plant-based dietary fiber in every single bottle. A cola that actually gives something back.",
    icon: "fiber",
    label_position: [0.192, 0.5598],
  },
  {
    title: "No Aspartame",
    tag_type: "out",
    tag: "Aspartame",
    body: "Not a drop. The sweetness comes from plants, because you deserve better!",
    icon: "aspartame",
    label_position: [0.2547, 0.5598],
  },
  {
    title: "The Numbers",
    tag_type: "in",
    tag: "Per 100 ml",
    body: "The full nutrition panel, straight off the bottle.",
    icon: "nutrition",
    label_position: [0.698, 0.418],
    spot: [0.22, 0.32],
    distance: 2.6,
    panel: "nutrition",
  },
  {
    title: "Every Ingredient",
    tag_type: "in",
    tag: "The whole list",
    body: "No codes without names. Here's every ingredient, and what it actually is.",
    icon: "ingredients",
    label_position: [0.884, 0.23],
    spot: [0.36, 0.15],
    distance: 2.8,
    panel: "ingredients",
  },
];

export const nutrition: [label: string, value: string][] = [
  ["Energy", "16.1 kcal"],
  ["Protein", "0.0 g"],
  ["Carbohydrates", "4.0 g"],
  ["Total sugars", "0.0 g"],
  ["Added sugars", "0.0 g"],
  ["Dietary fiber", "1.4 g"],
  ["Total fat", "0.0 g"],
  ["Sodium", "16.0 mg"],
];

export const ingredients: [name: string, plain: string][] = [
  ["Carbonated water", "The fizz"],
  ["Dietary fiber (2.8%)", "Wheat dextrin, FOS & inulin"],
  ["Sweeteners INS 968, 960", "Erythritol & stevia"],
  ["Acidity regulators INS 330, 331, 338", "Citric acid, sodium citrate, phosphoric acid"],
  ["Colour INS 150d", "Caramel colour"],
  ["Flavouring", "Natural & nature-identical"],
  ["Preservative INS 211", "Sodium benzoate"],
];

export const statement = {
  lines: ["No", "BS."],
  caption: "No artificial stuff. No fine print.",
};

// Drafted from the label. Review before launch.
export const faq: { question: string; answer: string }[] = [
  {
    question: "What makes Brewy different from regular cola?",
    answer:
      "Same cola hit, smarter formula: zero sugar, 16 kcal per 100 ml, no caffeine and no aspartame, plus 4g+ of plant-based prebiotic fiber in every bottle.",
  },
  {
    question: "Is Brewy fizzy?",
    answer: "Yes. It's made with carbonated water, so you get the full fizz.",
  },
  {
    question: "How much sugar and how many calories are in it?",
    answer:
      "0g total sugar and 0g added sugar. Each 100 ml has 16.1 kcal, so a 300 ml bottle is around 48 kcal.",
  },
  {
    question: "What sweetens Brewy?",
    answer:
      "Plant-based stevia (steviol glycosides, INS 960) and erythritol (INS 968). No aspartame, ever.",
  },
  {
    question: "Does Brewy have caffeine?",
    answer: "No. Drink it anytime. No jitters, no crash.",
  },
  {
    question: "What are the prebiotics in Brewy?",
    answer:
      "A 3-plant blend of dietary fibers: wheat dextrin, fructooligosaccharides (FOS) and inulin. That's 1.4 g per 100 ml, 4g+ per bottle. It contains wheat.",
  },
  {
    question: "Where do the colour and flavour come from?",
    answer:
      "The colour is caramel (INS 150d). The flavour comes from natural and nature-identical flavouring substances.",
  },
  {
    question: "Where is Brewy made?",
    answer:
      "Manufactured by Organico Agro Foods & Beverages Pvt. Ltd. in Bhiwandi, Maharashtra, and marketed by Brewy Naturals LLP, Mumbai. Proudly made in India.",
  },
  {
    question: "How should I store it?",
    answer:
      "Keep it in a cool, dry place away from sunlight, and don't drink it if the bottle is leaking or the seal is broken. Best served chilled!",
  },
];
