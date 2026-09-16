"use client";

import Link from "next/link";
import { useState } from "react";
import { getHealthBenefitIcon, getHealthBenefitSlug } from "@/lib/products";

// styled after Native Extracts' "More from the Lab" strip: equal-width
// panels sitting side by side, each labelled in its top-left corner, that
// expand toward whichever one is hovered/focused — clicking one goes
// straight to that indication's page. Only renders whatever indications
// this specific product actually carries (`product.healthBenefits`), so
// the count varies product to product instead of always showing the
// full site-wide list.
export default function IndicationStrip({ benefits }: { benefits: string[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="indication-strip">
      {benefits.map((benefit, i) => {
        const icon = getHealthBenefitIcon(benefit);
        const slug = getHealthBenefitSlug(benefit);
        return (
          <Link
            key={benefit}
            href={slug ? `/indications/${slug}` : "/products"}
            data-slug={slug}
            className={`indication-strip-item${active === i ? " is-active" : ""}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            {icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={icon} alt="" className="indication-strip-photo" aria-hidden="true" />
            )}
            <span className="indication-strip-label">{benefit}</span>
          </Link>
        );
      })}
    </div>
  );
}
