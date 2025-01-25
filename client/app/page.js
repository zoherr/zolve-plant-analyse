"use client"
import PlantImageUpload from "@/components/fileUpload";
import { LandingPage } from "@/components/landingPage";
import Image from "next/image";

export default function Home() {
    return (
        <div className="">
            <LandingPage />
            <PlantImageUpload />
        </div>
    );
}
