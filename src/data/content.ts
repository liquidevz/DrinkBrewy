    // Static content data for DrinkBrewy website

    export interface TextGroup {
    heading: string;
    body: string;
    image?: string;
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
            heading: "B Care",
            body: "Everything that feels & tastes good doesn't have to wreck you. Brewy proved it! Plants, Fibre, Pre-biotics - All Natural. Brewy will always put your wellness first!",
            image: "/1.png"
            },
            {
            heading: "The Brewy Promise",
            body: "We believe in transparency and quality. Every can is crafted with care to deliver the perfect balance of taste and health.",
            image: "/2.png"
            },
            {
            heading: "Commerce",
            body: "We don't play the premium nonsense game. Good for you ≠ expensive. If margins cry too bad, it still tastes right. We'll go broke before we go fake.",
            image: "/3.png"
            },
            {
            heading: "Creativity",
            body: "No AI, No Bollywood heroes, No overproduced 'relatable' ads. Our first film was a french indie shot in Mumbai. We're bringing back creativity - the kind you can't automate.",
            image: "/4.png"
            },
            {
            heading: "Community",
            body: "Brewy is NOT a product. It's a people thing. Made for traffic jams, bad meetings, unread feelings. Built for messy lives & guilty playlists. Meant to be passed hand to hand.",
            image: "/5.png"
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

