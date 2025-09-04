"use client";

import React from "react";
import Link from "next/link";
import "./ProjectsRow.css";

export type ProjectCard = {
    title: string;
    subtitle?: string;
    image: string;   // public altındaki path (örn: /projects/p1.jpg)
    href?: string;   // tıklanınca gidilecek yer (opsiyonel)
};

interface ProjectsRowProps {
    title: string;
    items: ProjectCard[];
}

const ProjectsRow: React.FC<ProjectsRowProps> = ({ title, items }) => {
    return (
        <section className="pr-row">
            <div className="pr-row-head">
                <h2 className="pr-row-title">{title}</h2>
            </div>

            <div className="pr-row-track" role="list">
                {items.map((it, i) => {
                    const CardContent = (
                        <article className="pr-card" role="listitem">
                            <div className="pr-card-media">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={it.image} alt={it.title} />
                            </div>
                            <div className="pr-card-overlay">
                                <div className="pr-card-text">
                                    <h3 className="pr-card-title">{it.title}</h3>
                                    {it.subtitle && (
                                        <p className="pr-card-subtitle">{it.subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </article>
                    );

                    return it.href ? (
                        <Link key={i} href={it.href} className="pr-card-link" aria-label={it.title}>
                            {CardContent}
                        </Link>
                    ) : (
                        <div key={i} className="pr-card-link" aria-label={it.title}>
                            {CardContent}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ProjectsRow;
