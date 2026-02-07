import DetailedServices from "@/components/DetailedServices";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Services | Amblify",
    description: "Explore our comprehensive range of digital services, from SEO to Visual Synthesis.",
};

export default function ServicesPage() {
    return (
        <main>
            <DetailedServices />
            <Footer />
        </main>
    );
}
