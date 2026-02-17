import "./About.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function About() {

  const members = [

    {
      name: "Nishan K",
      role: "Lead & Simulator Developer",
      dept: "Computer Science & Engineering",
      class: "4th Semester",
      section: "C Section",
      college: "The National Institute of Engineering, Mysore",
      img: "/members/nishan.jpeg",
      linkedin: "https://www.linkedin.com/in/nishan0021",
      github: "https://github.com/Nishan0021"
    },

    {
      name: "Raghunandhan S",
      role: "Frontend Developer",
      dept: "Computer Science & Engineering",
      class: "4th Semester",
      section: "C Section",
      college: "The National Institute of Engineering, Mysore",
      img: "/members/raghu.jpeg",
      linkedin: "https://www.linkedin.com/in/raghunandhan-s-22487b331",
      github: "https://github.com/raghunandhan2711"
    },

    {
      name: "Sharvan H",
      role: "Algorithm Analyst",
      dept: "Computer Science & Engineering",
      class: "4th Semester",
      section: "C Section",
      college: "The National Institute of Engineering, Mysore",
      img: "/members/sharvan.jpeg",
      linkedin: "https://www.linkedin.com/in/sharvan-h-a62447309",
      github: "https://github.com/sharvanh25-star"
    }

  ];

  return (

    <div className="about-container">

      <h1>About Us</h1>

      <p className="about-sub">
        Meet the team behind OS SimLab
      </p>

      <div className="team-grid">

        {members.map((m, i) => (

          <div className="member-card" key={i}>

            <img
              src={m.img}
              alt={m.name}
              className="member-img"
            />

            <h2>{m.name}</h2>

            <p className="role">{m.role}</p>

            <p>{m.dept}</p>

            <p>{m.class} </p>
            <p>{m.college}</p>

            {/* ICON SOCIAL LINKS */}
            <div className="social-links">

              <a
                href={m.linkedin}
                target="_blank"
                rel="noreferrer"
                className="icon linkedin"
              >
                <FaLinkedin />
              </a>

              <a
                href={m.github}
                target="_blank"
                rel="noreferrer"
                className="icon github"
              >
                <FaGithub />
              </a>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
