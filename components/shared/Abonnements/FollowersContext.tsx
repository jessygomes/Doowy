"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getFollowers } from "@/lib/actions/user.actions";

type Follower = {
  id: string;
  name: string | null;
  image: string | null;
};

type FollowersContextType = {
  followers: Follower[];
  loadFollowers: (userId: string) => Promise<void>;
  addFollower: (follower: Follower) => void;
  removeFollower: (followerId: string) => void;
};

const FollowersContext = createContext<FollowersContextType | undefined>(
  undefined
);

export const FollowersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [followers, setFollowers] = useState<Follower[]>([]);

  const loadFollowers = async (userId: string) => {
    try {
      const responseFollowers = await getFollowers({ userId });
      setFollowers(responseFollowers || []);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des utilisateurs suivis:",
        error
      );
      setFollowers([]);
    }
  };

  const addFollower = (follower: Follower) => {
    setFollowers((prevFollowers) => [...prevFollowers, follower]);
  };

  const removeFollower = (followerId: string) => {
    setFollowers((prevFollowers) =>
      prevFollowers.filter((follower) => follower.id !== followerId)
    );
  };

  return (
    <FollowersContext.Provider
      value={{ followers, loadFollowers, addFollower, removeFollower }}
    >
      {children}
    </FollowersContext.Provider>
  );
};

export const useFollowers = () => {
  const context = useContext(FollowersContext);
  if (!context) {
    throw new Error("useFollowers must be used within a FollowersProvider");
  }
  return context;
};
