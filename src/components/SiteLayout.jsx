import React from "react";
import { Outlet } from "react-router-dom";
import HomeNav from "@/components/home/HomeNav";

export default function SiteLayout() {
  return (
    <>
      <HomeNav />
      <Outlet />
    </>
  );
}