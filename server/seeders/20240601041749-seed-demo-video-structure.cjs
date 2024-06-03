"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const beatSheets = await queryInterface.bulkInsert(
      "beat_sheets",
      [
        {
          title: "Full Video Tutorial",
          description: "A detailed tutorial covering all aspects of the topic.",
          created_by: "poojamules95",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    const acts = await queryInterface.bulkInsert(
      "acts",
      [
        {
          title: "Introduction and Setup",
          beat_sheet_id: beatSheets[0].id,
          position: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Main Content",
          beat_sheet_id: beatSheets[0].id,
          position: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Conclusion",
          beat_sheet_id: beatSheets[0].id,
          position: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    await queryInterface.bulkInsert(
      "beats",
      [
        {
          title: "Brief introduction",
          description:
            "Brief introduction of the host and the topic of the video.",
          duration: 15,
          position: 1,
          act_id: acts[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Opening title/credits",
          description: "The opening title or credits for the video.",
          duration: 15,
          position: 2,
          act_id: acts[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Hook",
          description:
            "A hook to draw viewers in and get them interested in the rest of the video.",
          duration: 30,
          position: 3,
          act_id: acts[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Overview",
          description:
            "A more detailed overview of what will be covered in the video.",
          duration: 30,
          position: 4,
          act_id: acts[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Main Content - Part 1",
          description:
            "The first part of the main content. This could be a tutorial, product review, story, etc.",
          duration: 210,
          position: 1,
          act_id: acts[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Transition",
          description:
            "A brief transition between the first and second parts of the main content.",
          duration: 15,
          position: 2,
          act_id: acts[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Main Content - Part 2",
          description: "The second part of the main content.",
          duration: 225,
          position: 3,
          act_id: acts[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Summary and Tease",
          description:
            "Wrapping up the video, summarizing the key points, and perhaps providing a tease of what's coming in the next video.",
          duration: 60,
          position: 1,
          act_id: acts[2].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Call to Action",
          description: "Asking viewers to like, subscribe, comment, etc.",
          duration: 30,
          position: 2,
          act_id: acts[2].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "End Credits/Outro",
          description: "End credits, bloopers, or other outro material.",
          duration: 30,
          position: 3,
          act_id: acts[2].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("beats", null, {});
    await queryInterface.bulkDelete("acts", null, {});
    await queryInterface.bulkDelete("beat_sheets", null, {});
  },
};
