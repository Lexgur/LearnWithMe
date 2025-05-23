import { createPool } from "mysql2/promise";
import createAllUsers from "./user.js";
import createAllTopic from "./topic.js";
import createAllCourses from "./course.js";
import createAllParts from "./part.js";
import createAllUsersCourses from "./userCourses.js";
import createAllCertificates from "./certificate.js";
import createAllReviews from './review.js';
import createAllPayments from './payment.js';
import createAllPartContents from './partContents.js';

(async () => {
  console.log("Seeding database...");

  try {
    const pool = createPool({
      host: "localhost",
      user: "root",
      password: "root123",
      database: "learnwme",
      waitForConnections: true,
    });

    const con = await pool.getConnection();
    console.log("Connected to database.");

    const { users, teachersIds, adminId, editorId, usersCount } = createAllUsers();
    const { topics, topicsCount } = createAllTopic();
    const { courses, coursesCount } = createAllCourses(teachersIds, topicsCount);
    const { coursesPartCount, parts } = createAllParts(coursesCount);
    const { finishedCourses, userCourses } = createAllUsersCourses(usersCount, coursesPartCount, coursesCount);
    const certificates = createAllCertificates(finishedCourses);
    const { coursesRating, reviews } = createAllReviews(userCourses);
    const payments = createAllPayments(users);
    const partContents = createAllPartContents(parts);


    console.log("Generated certificates:", certificates);

    let sql;
    // TABLE DROPS
    const drops = [
      "sessions",
      "payments",
      "part_contents",
      "parts",
      "reviews",
      "certificates",
      "user_courses",
      "courses",
      "topics",
      "users",
    ];

    for (const table of drops) {
      const sql = `DROP TABLE IF EXISTS \`${table}\``;
      await con.query(sql);
      console.log(`Dropped ${table} table if it existed.`);
    }

    //TABLE CREATIONS

    // USERS TABLE

    sql = `
                CREATE TABLE IF NOT EXISTS users (
                id int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
                email varchar(77) NOT NULL,
                name varchar(40) NOT NULL,
                password char(60) NOT NULL,
                role set('subscriber','free','admin','editor','teacher') NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `;

    await con.query(sql);
    console.log("Users table OK");

    sql = `
            INSERT INTO users
            (email, name, password, role)
            VALUES ?
        `;

    await con.query(sql, [
      users.map((user) => [user.email, user.name, user.password, user.role]),
    ]);
    console.log("Users table seed OK");

    // TOPICS TABLE

    sql = `
        CREATE TABLE topics (
        id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
       title varchar(98) NOT NULL,
       topic_type set('Programming','Design','Cyber Security','Gaming') NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

    await con.query(sql);
    console.log("Topics table OK");

    sql = `
            INSERT INTO topics
            (title, topic_type)
            VALUES ?
        `;
    await con.query(sql, [
      topics.map((topic) => [topic.title, topic.topic_type]),
    ]);
    console.log("Topics table seed OK");

    // COURSES TABLE

    sql = `
                CREATE TABLE IF NOT EXISTS courses (
                id int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                title varchar(200) NOT NULL,
                description text NOT NULL,
                teacher_id int UNSIGNED DEFAULT NULL,
                topic_id int UNSIGNED NOT NULL,
                req_plan set('free','silver','gold') NOT NULL,
                rating decimal(3,2) UNSIGNED NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `;

    await con.query(sql);
    console.log("Courses table OK");

    sql = `
            INSERT INTO courses
            (title, description, teacher_id, topic_id, req_plan, rating)
            VALUES ?
        `;
    await con.query(sql, [
      courses.map((course) => [
        course.title,
        course.description,
        course.teacher_id,
        course.topic_id,
        course.req_plan,
        course.rating,
      ]),
    ]);
    console.log("Courses table seed OK");

    // USER COURSES TABLE

    sql = `
              CREATE TABLE IF NOT EXISTS user_courses (
              id int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
              user_id int UNSIGNED NOT NULL,
              course_id int UNSIGNED DEFAULT NULL,
              progress smallint UNSIGNED DEFAULT NULL,
              finished int NOT NULL DEFAULT '0'
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `;

    await con.query(sql);
    console.log("User courses table OK");

    sql = `
            INSERT INTO user_courses
            (user_id, course_id, progress, finished)
            VALUES ?
        `;

    await con.query(sql, [
      userCourses.map((userCourse) => [
        userCourse.user_id,
        userCourse.course_id,
        userCourse.progress,
        userCourse.finished,
      ]),
    ]);
    console.log("User courses table seed OK");

    // CERTIFICATES TABLE

    sql = `
                CREATE TABLE IF NOT EXISTS certificates (
                id int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id int UNSIGNED NOT NULL,
                course_id int UNSIGNED DEFAULT NULL,
                certificate_number varchar(32) NOT NULL,
                certificate_date date NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `;

    await con.query(sql);
    console.log("Certificates table OK");

    sql = `
            INSERT INTO certificates
            (user_id, course_id, certificate_number, certificate_date)
            VALUES ?
        `;
    await con.query(sql, [
      certificates.map((certificate) => [
        certificate.user_id,
        certificate.course_id,
        certificate.certificate_number,
        certificate.certificate_date,
      ]),
    ]);
    console.log("Certificates table seed OK");

    // REVIEWS

    sql = `
          CREATE TABLE reviews (
          id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
          user_id int(10) UNSIGNED DEFAULT NULL,
          course_id int(10) UNSIGNED NOT NULL,
          rating tinyint(3) UNSIGNED NOT NULL,
          description text NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
          `;
    await con.query(sql);
    console.log('Reviews table OK');

    sql = `
          INSERT INTO reviews
          (user_id, course_id, rating, description)
          VALUES ?
          `;
    await con.query(sql, [reviews.map(review => [review.user_id, review.course_id, review.rating, review.description])]);
    console.log('Reviews table seed OK');


    // PAYMENTS

    sql = `
          CREATE TABLE payments (
          id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
          user_id int(10) UNSIGNED NOT NULL,
          plan set('free','silver','gold') NOT NULL,
          end_plan datetime DEFAULT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
          `;
    await con.query(sql);
    console.log('Payments table OK');

    sql = `
            INSERT INTO payments
            (user_id, plan, end_plan)
            VALUES ?
            `;
    await con.query(sql, [payments.map(payment => [payment.user_id, payment.plan, payment.end_plan])]);
    console.log('Payments table seed OK');


    // SESSIONS

    sql = `
            CREATE TABLE sessions (
            id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
            user_id int(10) UNSIGNED NOT NULL,
            token char(36) NOT NULL,
            start_time timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
            )  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `;
    await con.query(sql);
    console.log('Sessions table OK');

    // PARTS

    sql = `
CREATE TABLE parts (
  \`id\` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  \`course_id\` int(10) UNSIGNED NOT NULL,
  \`row_number\` tinyint(4) NOT NULL,
  \`title\` varchar(98) NOT NULL,
  \`description\` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;
await con.query(sql);
console.log('Parts table OK');

sql = `
  INSERT INTO parts
  (\`course_id\`, \`row_number\`, \`title\`, \`description\`)
  VALUES ?
`;
await con.query(sql, [parts.map(part => [part.course_id, part.row_number, part.title, part.description])]);
console.log('Parts table seed OK');

    // PART_CONTENTS

   sql = `
CREATE TABLE part_contents (
  id int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  \`row_number\` tinyint(4) NOT NULL,
  video_link varchar(250) DEFAULT NULL,
  image_link varchar(250) DEFAULT NULL,
  text_block text DEFAULT NULL,
  part_id int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;
await con.query(sql);
console.log('Part_contents table OK');

sql = `
INSERT INTO part_contents
(\`row_number\`, video_link, image_link, text_block, part_id)
VALUES ?
`;
await con.query(sql, [partContents.map(partContent => [partContent.row_number, partContent.video_link, partContent.image_link, partContent.text_block, partContent.part_id])]);
console.log('Part_contents table seed OK');


    con.release();
    console.log("Database connection released.");
    await pool.end();
  } catch (error) {
    console.log("Error connecting to database:", error);
    process.exit(1);
  }
})();
