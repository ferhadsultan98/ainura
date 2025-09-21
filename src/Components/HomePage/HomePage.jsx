import React from "react";
import "./HomePage.scss";

import ImageSlider from "../../Pages/ImageSlider/ImageSlider";
import ImageGallery from "../../Pages/ImageGallery/ImageGallery";
import VideoGallery from "../../Pages/VideoGallery/VideoGallery";
import VideoSlider from "../../Pages/VideoSlider/VideoSlider";


function HomePage({ activeTab = "images" }) {
  return (
    <div className="homePage">

      {activeTab === "images" && (
        <>
          <section className="homeSection" id="images-top">
            <ImageSlider />
          </section>
          <section className="homeSection">
            <ImageGallery />
          </section>
        </>
      )}


      {activeTab === "videos" && (
        <>
          <section className="homeSection" id="videos-top">
            <VideoSlider />
          </section>
          <section className="homeSection">
            <VideoGallery />
          </section>
        </>
      )}
    </div>
  );
}

export default HomePage;
