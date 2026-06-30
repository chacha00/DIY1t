import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="brand-gradient-bg animate-gradient relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center shadow-soft-lg sm:px-16">
          <Sparkles className="mx-auto h-10 w-10 text-white/90" />
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to build your first project?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/90">
            Upload a photo right now and get a full DIY guide in seconds.
            No experience required.
          </p>
          <div className="mt-8 flex justify-center">
            <LinkButton
              href="/register"
              size="lg"
              className="bg-white text-brand-blue-700 hover:bg-white/90 hover:shadow-none"
            >
              Start Free Today
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
