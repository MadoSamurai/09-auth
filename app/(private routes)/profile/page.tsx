"use client";

import css from "./ProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <img
            src={user?.avatar || "https://placehold.co/120"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username || "Not specified"}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}
