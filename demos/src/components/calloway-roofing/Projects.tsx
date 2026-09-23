import Image from "next/image";
import type { Project } from "@/data/calloway-roofing";

type ProjectsProps = {
  projects: Project[];
  city: string;
};

export function Projects({ projects, city }: ProjectsProps) {
  return (
    <section id="projects" className="scroll-mt-24 bg-cr-paper py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.16em] text-[var(--cr-accent-ink)]">
              <span className="h-0.5 w-[26px] bg-[var(--cr-accent-ink)]" aria-hidden="true" />
              RECENT WORK
            </p>
            <h2
              className="mt-4 font-cr-display font-extrabold leading-[1.08] tracking-[-0.03em]"
              style={{ fontSize: "clamp(30px, 3.6vw, 44px)" }}
            >
              Projects Across {city}
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center text-[15px] font-bold text-[var(--cr-accent-ink)] underline decoration-[var(--cr-accent-ink)] decoration-2 underline-offset-[6px]"
          >
            View all projects
          </a>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <li key={project.title} className="card-hairline overflow-hidden rounded-2xl bg-white">
              <div className="relative h-[260px]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-cr-display text-[19px] font-bold tracking-[-0.02em]">
                  {project.title}
                </h3>
                <p className="mt-2 text-[15px] text-cr-ink/60">{project.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Projects;
