import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import HttpStatusCodes from '../@enums/http-status-codes.enum';
import UsersMock from '../auth/@mocks/users.mock';
import TaskStatus from './@enums/task-status.enum';
import TasksMock from './@mocks/tasks.mock';
import Task from './entities/task.entity';
import TasksService from './tasks.service';

describe('tasks service', () => {
  let tasksService: TasksService;
  let tasksRepository: Repository<Task>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  describe('get', () => {
    it('should call repository `get` to retrieve a task', async () => {
      const id = 'one';
      const user = UsersMock[0];
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValueOnce(TasksMock[0]);

      const result = await tasksService.get(id, user);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({ where: { id, user } });
      expect(result).toEqual(TasksMock[0]);
    });

    it('should throw an exception when a task is not found', async () => {
      const id = 'bip';
      const user = UsersMock[0];
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValueOnce(undefined);

      let result: Task | null = null;
      try {
        result = await tasksService.get(id, user);
      } catch (e) {
        expect(tasksRepository.findOne).toHaveBeenCalledWith({ where: { id, user } });
        expect(result).toBeNull();
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(HttpStatusCodes.NotFound);
      }
    });
  });

  describe('getMany', () => {
    let mockQuery: SelectQueryBuilder<Task>;

    beforeEach(() => {
      mockQuery = {
        andWhere: jest.fn(),
        getMany: jest.fn(),
        where: jest.fn(),
      } as unknown as SelectQueryBuilder<Task>;
    });

    it('should call repository `getMany` and return array', async () => {
      jest.spyOn(tasksRepository, 'createQueryBuilder').mockImplementation(() => mockQuery);
      (mockQuery.getMany as jest.Mock).mockResolvedValueOnce([]);
      const user = UsersMock[0];

      const result = await tasksService.getMany({}, user);

      expect(mockQuery.getMany).toHaveBeenCalled();
      expect(mockQuery.andWhere).not.toHaveBeenCalled();
      expect(mockQuery.where).toHaveBeenCalledWith({ user });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should call repository `getMany` and return array with a status filter', async () => {
      jest.spyOn(tasksRepository, 'createQueryBuilder').mockImplementation(() => mockQuery);
      (mockQuery.getMany as jest.Mock).mockResolvedValueOnce([]);
      const user = UsersMock[0];

      const result = await tasksService.getMany({ status: TaskStatus.OPEN }, user);

      expect(mockQuery.getMany).toHaveBeenCalled();
      expect(mockQuery.andWhere).toHaveBeenCalledTimes(1);
      expect(mockQuery.where).toHaveBeenCalledWith({ user });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should call repository `getMany` and return array with a search term', async () => {
      jest.spyOn(tasksRepository, 'createQueryBuilder').mockImplementation(() => mockQuery);
      (mockQuery.getMany as jest.Mock).mockResolvedValueOnce([]);
      const user = UsersMock[0];

      const result = await tasksService.getMany({ search: 'test' }, user);

      expect(mockQuery.getMany).toHaveBeenCalled();
      expect(mockQuery.andWhere).toHaveBeenCalledTimes(1);
      expect(mockQuery.where).toHaveBeenCalledWith({ user });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should call repository `getMany` and return array with a search term and a status filter', async () => {
      jest.spyOn(tasksRepository, 'createQueryBuilder').mockImplementation(() => mockQuery);
      (mockQuery.getMany as jest.Mock).mockResolvedValueOnce([]);
      const user = UsersMock[0];

      const result = await tasksService.getMany(
        { search: 'test', status: TaskStatus.IN_PROGRESS },
        user,
      );

      expect(mockQuery.getMany).toHaveBeenCalled();
      expect(mockQuery.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQuery.where).toHaveBeenCalledWith({ user });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw an error when there is a db problem', async () => {
      jest.spyOn(tasksRepository, 'createQueryBuilder').mockImplementation(() => mockQuery);
      (mockQuery.getMany as jest.Mock).mockRejectedValueOnce(new Error('test'));
      const user = UsersMock[0];

      let result: Array<Task> | null = null;
      try {
        result = await tasksService.getMany({ search: 'test', status: TaskStatus.OPEN }, user);
      } catch (e) {
        expect(result).toBeNull();
        expect(e).not.toBeNull();
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.status).toBe(HttpStatusCodes.InternalServerError);
      }
    });
  });
});
