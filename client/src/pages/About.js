import React from "react";
import Layout from "../components/layout/Layout";
const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            Hey there!. <br />
            This Website is created by Raunak Agarwal.
            <br />
            <a href="https://raunakkkkk.github.io/Portfolio-Website/">
              {" "}
              Visit my portfolio website :{" "}
            </a>
            <br />
            Email: agarwalraunak2000@gmail.com
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
