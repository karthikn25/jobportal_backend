// const express = require("express");
// const { Notes } = require("../Models/notes.js");

// const router = express.Router();

// router.get("/all", async (req, res) => {
//   try {
//     const notes = await Notes.find().populate("user", "name email avatar");
//     if (!notes) {
//       return res.status(400).json({ message: "Notes not available" });
//     }
//     res.status(200).json({ message: "Successfully retrived Data", notes });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.get("/getall/:id", async (req, res) => {
//   try {
//     const notes = await Notes.find({})
//       .where({ user: { $ne: req.params.id } })
//       .populate("user", "name email avatar");
//     if (!notes) {
//       return res.status(400).json({ message: "Couldn't fond any data" });
//     }
//     res.status(200).json({ message: "Successfully found your data", notes });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });



// router.get("/getsingle/:id", async (req, res) => {
//   try {
//     const notes = await Notes.findOne({ _id: req.params.id }).populate(
//       "user",
//       "email name avatar"
//     );
//     if (!notes) {
//       res.status(400).json({ message: "Error Occured in Data Found" });
//     }
//     res.status(200).json({ message: "Data found successfully", notes });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.get("/user",async(req,res)=>{
//   try {
//     const notes = await Notes.find({user:req.user._id}).populate("user","name email avatar location position");
//     if(!notes){
//       res.status(400).json({message:"Data not available"})
//     }
//     res.status(200).json({message:"Data found Successfully",notes})
    
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// })




// router.put("/edit/:id", async (req, res) => {
//   try {
//     const updatedNotes = await Notes.findOneAndUpdate(
//       { _id: req.params.id },
//       { $set: req.body },
//       { new: true }
//     );
//     if (!updatedNotes) {
//       return res.status(400).json({ message: "Error occured in Updation" });
//     }
//     res
//       .status(200)
//       .json({ message: "Successfully Updated", data: updatedNotes });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.delete("/remove/:id", async (req, res) => {
//   try {
//     const removeNotes = await Notes.findByIdAndDelete({ _id: req.params.id });
//     if (!removeNotes) {
//       return res
//         .status(400)
//         .json({ message: "Error occured in data Deletion" });
//     }
//     res.status(200).json({ message: "Data Remove Successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// const notesRouter = router;

// module.exports = { notesRouter };
const express = require('express');
const { Notes } = require('../Models/notes.js');

const router = express.Router();

// Get all notes (no authentication required)
router.get("/all", async (req, res) => {
  try {
    const notes = await Notes.find().populate("user", "name email avatar");
    if (!notes) {
      return res.status(400).json({ message: "Notes not available" });
    }
    res.status(200).json({ message: "Successfully retrieved Data", notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get notes excluding the current user's notes (authenticated route)
router.get("/getall/:id", async (req, res) => {
  try {
    const notes = await Notes.find({}).where({ user: { $ne: req.params.id } }).populate("user", "name email avatar");
    if (!notes) {
      return res.status(400).json({ message: "Couldn't find any data" });
    }
    res.status(200).json({ message: "Successfully found your data", notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get single note by ID
router.get("/getsingle/:id", async (req, res) => {
  try {
    const notes = await Notes.findOne({ _id: req.params.id }).populate("user", "email name avatar");
    if (!notes) {
      res.status(400).json({ message: "Error Occured in Data Found" });
    }
    res.status(200).json({ message: "Data found successfully", notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.post("/create/:id", async (req, res) => {
  const postedDate = new Date().toJSON().slice(0, 10);

  try {
    
    const notes = new Notes({
      ...req.body,
      date: postedDate,
      user: req.params.id
      
    });
    await notes.save();
    notes.populate("user","name email avatar")
    res.status(201).json({message:"Data upload successfully",notes})
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/search/:keyword",async(req,res)=>{
  try {
    const {keyword} = req.params;   
    const notes = await Notes.find({
      $or:[
        {companyName:{$regex:keyword, $options:"i"}},
        {position:{$regex:keyword, $options:"i"}},
        {location:{$regex:keyword, $options:"i"}}
      ]
    }).populate("user","name email avatar")
    if(!notes){
      res.status(400).json({message:"Data not Found"})
    }
    res.status(200).json({message:"Data Found Successfully",length:notes.length,notes})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

// router.get("/data/:id", async (req, res) => {
//   try {
//     const notes = await Notes.find({ user: req.params.id}).populate(
//       "user",
//       "name email avatar"
//     );
//     if (!notes) {
//       return res.status(400).json({ message: "Couldn't fond any data" });
//     }
//     res
//       .status(200)
//       .json({ message: "Successfully found your data", length: notes.length,notes });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


// Update note by ID (requires authentication)

router.get("/data/:id", async (req, res) => {
  try {
    // Find all notes by the user ID passed in the request parameters
    const notes = await Notes.find({ user: req.params.id }).populate("user", "name email avatar");

    // Check if the user has any notes
    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "No notes found for this user" });
    }

    // Respond with the notes and their count
    res.status(200).json({
      message: "Successfully found user's notes",
      length: notes.length, // Number of notes uploaded by the user
      notes, // Return the actual notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const updatedNotes = await Notes.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedNotes) {
      return res.status(400).json({ message: "Error occurred in Updation" });
    }
    res.status(200).json({ message: "Successfully Updated", data: updatedNotes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete note by ID (requires authentication)
router.delete("/remove/:id", async (req, res) => {
  try {
    const removeNotes = await Notes.findByIdAndDelete({ _id: req.params.id });
    if (!removeNotes) {
      return res.status(400).json({ message: "Error occurred in data Deletion" });
    }
    res.status(200).json({ message: "Data Remove Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" })
  }
});

module.exports = { notesRouter: router };
