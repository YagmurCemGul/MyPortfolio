"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';
import blueImage from '@/images/blue.png';
import greyImage from '@/images/grey.png';
import redImage from '@/images/red.png';
import yellowImage from '@/images/yellow.png';
import styles from './browse.module.css';

const Browse: React.FC = () => {
  const router = useRouter();

  const profiles = [
    {
      name: "Recruiter",
      image: blueImage,
      backgroundGif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZ5eWwwbjRpdWM1amxyd3VueHhteTVzajVjeGZtZGJ1dDc4MXMyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/16u7Ifl2T4zYfQ932F/giphy.gif" // Dark storm clouds
    },
    {
      name: "Developer",
      image: greyImage,
      backgroundGif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGNidDl5emZpejY2eGFxa2I4NW0zZGNpbWRlbnBrZ3N2dWhhbzM1MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TFPdmm3rdzeZ0kP3zG/giphy.gif" // Flickering neon lights
    },
    {
      name: "Stalker",
      image: redImage,
      backgroundGif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExc28yMjMyZmJ6eWtxbmNwdDV6cXk4dWZmcjFhZms2cXBjN2h5ZDJjeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QjZXUBUr89CkiWLPjL/giphy.gif" // Dark, abstract digital lights
    },
    {
      name: "Contact",
      image: yellowImage,
      backgroundGif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmxib24ycWo2cjlmazh0NGV5NTZ2Mzd2YWY0M2tvam9oYXBwYW1ocCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ERKMnDK6tkzJe8YVa3/giphy-downsized-large.gif" // Dark ocean waves at night
    },
  ];

  const handleProfileClick = (profile: { name: string; image: any; backgroundGif: string }) => {
    try {
      const imgSrc = typeof profile.image === 'string' ? profile.image : (profile.image?.src ?? '');
      localStorage.setItem('selectedProfile', JSON.stringify({ name: profile.name, image: imgSrc, backgroundGif: profile.backgroundGif }));
    } catch {}

    const name = profile.name.toLowerCase();
    if (name === 'recruiter' || name === 'developer') {
      router.push('/projects');
      return;
    }
    if (name === 'stalker') {
      router.push('/stalker');
      return;
    }
    if (name === 'contact') {
      router.push('/adventurer');
      return;
    }
    router.push('/adventurer');
  };

  return (
    <div className={styles["browse-container"]}>
      <p className={styles['who-is-watching']}>Who's Watching?</p>
      <div className={styles.profiles}>
        {profiles.map((profile, index) => (
          <ProfileCard
            key={index}
            name={profile.name}
            image={profile.image}
            onClick={() => handleProfileClick(profile)}
          />
        ))}
      </div>
    </div>
  );
};

export default Browse;
