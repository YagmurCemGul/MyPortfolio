"use client";

import React from 'react';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  name: string;
  image: any; // string | StaticImageData
  onClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, image, onClick }) => {
  const imgSrc = typeof image === 'string' ? image : (image?.src ?? '');
  return (
    <div className={styles["profile-card"]} onClick={onClick}>
      <div className={styles["image-container"]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgSrc} alt={`${name} profile`} className={styles["profile-image"]} />
      </div>
      <h3 className={styles["profile-name"]}>{name}</h3>
    </div>
  );
};

export default ProfileCard;
