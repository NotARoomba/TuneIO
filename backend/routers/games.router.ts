import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import STATUS_CODES from "../models/status";
import { GAMES, HighScore } from "../models/games";
import { ObjectId } from "mongodb";

export const gamesRouter = express.Router();

gamesRouter.use(express.json());

gamesRouter.post("/update", async (req: Request, res: Response) => {
  const gameData = req.body.game;
  const userID = req.body.userID;
  const gameType: GAMES = req.body.type;
  try {
    if (collections.users) {
     await collections.users.updateOne(
        { _id: new ObjectId(userID) },
        { $push: { [gameType]: gameData } },
      );
    }
    res.send({ status: STATUS_CODES.SUCCESS });
  } catch (error) {
    console.log(error);
    res.send({ status: STATUS_CODES.GENERIC_ERROR });
  }
});

gamesRouter.get("/:gameType/highscores/", async (req: Request, res: Response) => {
  const gameType: GAMES = req?.params?.gameType as GAMES;
  let highscores: HighScore[] = [];
  try {
    if (collections.users) {
      // for tuneio
      highscores = [GAMES.TYPING_LYRICS, GAMES.TYPING_ALBUM, GAMES.TYPING_ARTIST].includes(gameType) ? await collections.users.aggregate([
        // Unwind the games array
        {
          $unwind: `$${gameType}`
        },
        // Project the necessary fields including the correct field
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            [`${gameType}.score`]: 1,
            [`${gameType}.time`]: 1,
            [`${gameType}.correct`]: 1  // Include the correct field
          }
        },
        // Sort by score in descending order
        {
          $sort: {
            [`${gameType}.score`]: -1,
          }
        },
        // Group by document ID and find the highest score for each user
        {
          $group: {
            _id: "$_id",
            username: { $first: "$username" },
            avatar: { $first: "$avatar" },
            time: { $first: `$${gameType}.time` },
            correct: { $first: `$${gameType}.correct` }, // Include correct in grouping
            highestScore: {
              $first: `$${gameType}.score`
            }
          }
        },
        // Sort globally by the highest score
        {
          $sort: {
            "highestScore": -1
          }
        },
        // Project to clean up the result
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            correct: 1,  // Include correct in the final projection
            time: 1,
            score: "$highestScore"
          }
        }
      ]).toArray() as unknown as HighScore[] : await collections.users.aggregate([
        // Unwind the guessGames array
        {
          $unwind: `$${gameType}`
        },
        // Project the necessary fields
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            [`${gameType}.guesses`]: 1,
            [`${gameType}.score`]: 1
          }
        },
        // Sort by time in ascending order and score in descending order
        {
          $sort: {
            [`${gameType}.score`]: -1
          }
        },
        // Group by document ID and find the top score for each game
        {
          $group: {
            _id: "$_id",
            username: {
              $first: "$username"
            },
            avatar: {
              $first: "$avatar"
            },
            highestScore: {
              $first: `$${gameType}.score`
            }
          }
        },
        // Sort globally by the highest score
        {
          $sort: {
            "highestScore.score": -1
          }
        },
        // Project to clean up the result
        {
          $project: {
            _id: 1,
            username: 1,
            avatar: 1,
            guesses: 1,
            score: "$highestScore.score",
          }
        }
      ]).toArray() as unknown as HighScore[]
    }
    res.send({ highscores, status: STATUS_CODES.SUCCESS });
  } catch (error) {
    console.log(error);
    res.send({ status: STATUS_CODES.GENERIC_ERROR });
  }
});