

//1.Find all the topics and tasks which are thought in the month of October
db.topics.find({ month: "October" });
db.tasks.find({ month: "October" });

//2.Find all the company drives which appeared between 15-Oct-2020 and 31-Oct-2020
db.company_drives.find({
    date: { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") }
  });

//3.Find all the company drives and students who appeared for the placement
db.company_drives.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "students",
        foreignField: "user_id",
        as: "students_details"
      }
    }
  ]);

//4. Find the number of problems solved by the user in codekata
db.codekata.aggregate([
    {
      $group: {
        _id: "$user_id",
        totalProblemsSolved: { $sum: "$problems_solved" }
      }
    }
  ]);

//5. Find all the mentors who have mentees count more than 15
db.mentors.find({ mentee_count: { $gt: 15 } });

//6. Find the number of users who are absent and tasks not submitted between 15-Oct-2020 and 31-Oct-2020
db.attendance.aggregate([
    {
      $match: {
        date: { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") },
        status: "Absent"
      }
    },
    {
      $lookup: {
        from: "tasks",
        localField: "user_id",
        foreignField: "user_id",
        as: "task_details"
      }
    },
    {
      $match: { "task_details.status": "Not Submitted" }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ]);