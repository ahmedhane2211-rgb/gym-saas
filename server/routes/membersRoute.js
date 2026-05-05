import express from 'express';
import { createMember, deleteMember, getAllMembers, getMemberById, updateMember } from '../controllers/memberController.js';
import { authUser } from '../middlewares/authUser.js';
import authorize from '../middlewares/authorize.js';
export const memberRouter = express.Router();

memberRouter.get('/', authUser,authorize(["admin","reception"]),getAllMembers);

memberRouter.get('/:id', authUser,authorize(["admin","reception"]),getMemberById);

memberRouter.post('/', authUser,authorize(["admin","reception"]),createMember);

memberRouter.put('/:id', authUser,authorize(["admin","reception"]),updateMember);

memberRouter.delete('/:id', authUser,authorize(["admin"]),deleteMember);