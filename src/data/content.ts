    // Static content data for DrinkBrewy website

    export interface TextGroup {
    heading: string;
    body: string;
    }

    export interface HeroSlice {
    type: "hero";
    heading: string;
    subtitle: string;
    subheading: string;
    body: string;
    button_text: string;
    button_link: string;
    cans_image: string;
    second_body: string;
    }

    export interface AlternatingTextSlice {
    type: "alternating_text";
    text_group: TextGroup[];
    }

    export interface CarouselSlice {
    type: "carousel";
    heading: string;
    price_copy: string;
    }

    export interface BigTextSlice {
    type: "big_text";
    text: string;
    }

    export interface SkyDiveSlice {
    type: "skydive";
    }

    export type Slice = HeroSlice | AlternatingTextSlice | CarouselSlice | BigTextSlice | SkyDiveSlice;

    export interface PageData {
    title: string;
    meta_title: string;
    meta_description: string;
    slices: Slice[];
    }

    // Home page content
    export const homePageData: PageData = {
    title: "Brewy - India’s Guiltfree Cola",
    meta_title: "Brewy - India’s Guiltfree Cola",
    meta_description: "Discover the cola they said couldn’t exist — Same Taste, Smarter Formula, Just Brewy.",
    slices: [
        {
        type: "hero",
        heading: "Cola Reborn",
        subtitle :"Zero Added Sugar. Low Cal. Added Prebiotics. Plant-Based. No Artificial Stuff. No BS!",
        subheading: "FREE FREE FREE!",
        body: "We’ll send you 3 Brewys for free — you just cover shipping",
        button_text: "Explore Flavors",
        button_link: "#flavors",
        cans_image: "/labels/brewy.png",
        second_body: "Available in stores nationwide. Try all our amazing flavors today!"
        },
        {
        type: "skydive"
        },
        {
        type: "alternating_text",
        text_group: [
            {
            heading: "Strawberry Sensation",
            body: "Sweet and refreshing strawberry flavor that bursts with every sip. Made with real fruit extracts for an authentic taste experience."
            },
            {
            heading: "Cherry Blast",
            body: "Bold cherry flavor with a perfect balance of sweet and tart. A classic favorite that never gets old."
            },
            {
            heading: "Grape Fusion",
            body: "Rich grape taste that's smooth and satisfying. Perfect for any time of day when you need a refreshing break."
            },
            {
            heading: "Lemon-Lime Sparkle",
            body: "Crisp and citrusy with a perfect fizz. The ultimate thirst quencher that keeps you coming back for more."
            },
            {
            heading: "Watermelon Wave",
            body: "Fresh watermelon flavor that's light and refreshing. Summer in a can, available all year round."
            }
        ]
        },
        {
        type: "carousel",
        heading: "Choose Your Flavor",
        price_copy: "Starting at $2.99 per can. Available in 6-packs and 12-packs."
        },
        {
        type: "big_text",
        text: "REFRESHINGLY DIFFERENT"
        }
    ]
    };

    // You can add more pages here as needed
    export const pages: { [key: string]: PageData } = {
    home: homePageData
    };

