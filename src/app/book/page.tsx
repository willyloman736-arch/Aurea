import { Suspense } from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { BookForm } from "./book-form";

export const metadata: Metadata = {
  title: "Book a pickup · USPS-S",
  description:
    "Schedule a pickup in two minutes. Tell us when, where, and what — a courier arrives in your booked window.",
};

export default function BookPage() {
  return (
    <PageShell
      eyebrow="Book"
      title={
        <>
          Schedule a <em>pickup.</em>
        </>
      }
      lede="Tell us when and where. A courier arrives in the booked window, scans the cargo into custody, and you watch every checkpoint live."
    >
      <Suspense fallback={<div className="ship-form" />}>
        <BookForm />
      </Suspense>
    </PageShell>
  );
}
