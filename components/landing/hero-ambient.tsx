"use client";

import { motion } from "motion/react";

/**
 * Decorative hero floaters — theme-aware glass panels.
 */
export function HeroAmbient() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      aria-hidden
    >
      <div className="absolute left-[4%] top-[18%] size-[min(40vw,420px)] rounded-full bg-chart-1/15 blur-[100px] animate-float-soft motion-reduce:animate-none" />
      <div className="absolute right-[2%] top-[32%] size-[min(32vw,340px)] rounded-full bg-chart-2/12 blur-[90px] animate-float-soft-reverse motion-reduce:animate-none" />
      <div className="absolute bottom-[22%] left-[18%] size-48 rounded-full bg-chart-3/10 blur-3xl animate-pulse-glow motion-reduce:animate-none" />

      <div className="absolute left-1/2 top-[12%] size-[min(85vw,520px)] -translate-x-1/2 rounded-full border border-border/40 animate-spin-slow motion-reduce:animate-none" />
      <div className="absolute left-1/2 top-[14%] size-[min(65vw,400px)] -translate-x-1/2 rounded-full border border-dashed border-border/50 motion-reduce:animate-none animate-spin-slow [animation-duration:38s] [animation-direction:reverse]" />

      <motion.div
        className="absolute right-[4%] top-[26%] hidden xl:block"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="liquid-glass-strong glass-panel-glow max-w-[220px] rounded-3xl px-6 py-5 shadow-lg shadow-foreground/5">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Sync
          </p>
          <p className="mt-2 font-heading text-3xl italic leading-none tracking-tight text-foreground">
            Live
          </p>
          <p className="mt-2 font-body text-xs font-light leading-snug text-muted-foreground">
            Stock levels update as documents move through your warehouses.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-[3%] top-[42%] hidden lg:block"
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <div className="liquid-glass-strong glass-panel-glow max-w-[220px] rounded-3xl px-6 py-5 shadow-lg shadow-foreground/5">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Workflow
          </p>
          <p className="mt-2 font-heading text-3xl italic leading-none tracking-tight text-foreground">
            Draft to done
          </p>
          <p className="mt-2 font-body text-xs font-light leading-snug text-muted-foreground">
            Same document states for receipts, deliveries, transfers, and
            adjustments.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[26%] right-[8%] hidden md:block"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="liquid-glass max-w-[200px] rounded-2xl border border-border/80 px-6 py-3.5 text-center shadow-md shadow-foreground/5">
          <p className="font-heading text-lg italic text-foreground">
            Org-scoped
          </p>
          <p className="mt-1 font-body text-[11px] font-light text-muted-foreground">
            Users only see data for their organization.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
