
const AboutUs = () => {
  return (
    <div className=" mx-auto space-y-12 py-30">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Us
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
            Learn more about our mission, values, and the team behind this project.
        </p>
      </header>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <img
          src={'https://res.cloudinary.com/dbk1x83kg/image/upload/v1765105613/blog/r5u7bemei7xhzrxrwkpm.jpg'}
          alt="Team"
          className="rounded-xl shadow-lg w-full h-80 object-cover"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
              Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
              Our mission is to create high-quality, accessible content for developers worldwide,
              helping them learn, grow, and build amazing projects with confidence.
          </p>

          <h2 className="text-2xl font-semibold mt-4">
              Our Vision
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
              We envision a community where learning and sharing knowledge is seamless,
              empowering everyone to achieve their development goals efficiently.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section>
        <h2 className="text-3xl font-bold  text-center mb-8">
            Meet the Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: 'Nguyen Chanh Bao', role: 'Fullstack Developer', img: 'https://res.cloudinary.com/dbk1x83kg/image/upload/v1764171692/users/ztwsjsuxr6vs409sjaw5.jpg' },
            { name: 'Nguyen Chanh Bao', role: 'UI/UX Designer', img: 'https://res.cloudinary.com/dbk1x83kg/image/upload/v1764171692/users/ztwsjsuxr6vs409sjaw5.jpg' },
            { name: 'Nguyen Chanh Bao', role: 'Backend Developer', img: 'https://res.cloudinary.com/dbk1x83kg/image/upload/v1764171692/users/ztwsjsuxr6vs409sjaw5.jpg' }
          ].map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold ">{member.name}</h3>
              <p className="text-gray-500 dark:text-gray-300">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="text-center bg-blue text-white rounded-xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Collaborate?</h2>
        <p className="mb-6">
            Reach out to us and let&apos;s build something amazing together!
        </p>
        <button className="px-6 py-3 bg-white text-blue rounded-lg font-medium hover:bg-gray-100 transition">
            Contact Us
        </button>
      </section>
    </div>
  )
}

export default AboutUs
