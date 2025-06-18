import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    // Calculate end date based on duration
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + createProjectDto.durationInDays);
    
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId: userId,
      endDate,
      status: ProjectStatus.PENDING_APPROVAL,
      updates: [],
    });
    
    return this.projectsRepository.save(project);
  }

  async findAll(filters?: any): Promise<Project[]> {
    const query = this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner');
      
    if (filters) {
      if (filters.category) {
        query.andWhere('project.category = :category', { category: filters.category });
      }
      
      if (filters.location) {
        query.andWhere('project.location ILIKE :location', { location: `%${filters.location}%` });
      }
      
      if (filters.status) {
        query.andWhere('project.status = :status', { status: filters.status });
      }
    }
    
    // Default filter to show only public projects (active, funded, completed)
    if (!filters?.includeNonPublic) {
      query.andWhere('project.status IN (:...statuses)', { 
        statuses: [ProjectStatus.ACTIVE, ProjectStatus.FUNDED, ProjectStatus.COMPLETED] 
      });
    }
    
    return query.getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ 
      where: { id },
      relations: ['owner']
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async findUserProjects(userId: string): Promise<Project[]> {
    return this.projectsRepository.find({ 
      where: { ownerId: userId },
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string, userRole: UserRole): Promise<Project> {
    const project = await this.findOne(id);
    
    // Only owner or admin can update
    if (project.ownerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to update this project');
    }
    
    // Special handling for status updates
    if (updateProjectDto.status) {
      // Only admin can change to ACTIVE or REJECTED
      if (
        (updateProjectDto.status === ProjectStatus.ACTIVE || 
         updateProjectDto.status === ProjectStatus.REJECTED) && 
        userRole !== UserRole.ADMIN
      ) {
        throw new ForbiddenException('Only administrators can approve or reject projects');
      }
      
      // When approving, recalculate end date
      if (updateProjectDto.status === ProjectStatus.ACTIVE) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + project.durationInDays);
        project.endDate = endDate;
      }
    }
    
    // Handle project updates
    if (updateProjectDto.updates) {
      project.updates = updateProjectDto.updates;
    }
    
    Object.assign(project, updateProjectDto);
    
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const project = await this.findOne(id);
    
    // Only owner or admin can delete
    if (project.ownerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }
    
    await this.projectsRepository.remove(project);
  }
}
