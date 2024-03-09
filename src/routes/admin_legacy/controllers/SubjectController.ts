import SubjectRepository from '../repositories/SubjectRepository'

import type { Request, Response } from 'express'

class SubjectController {
  async findAll(_: Request, response: Response) {
    try {
      const Subjects = await SubjectRepository.findAll()
  
      if (!Subjects) {
        response.status(400).send('Subjects not found')
        return
      }
  
      response.status(200).send(Subjects)
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async findById(request: Request, response: Response) {
    try {
      const { id } = request.params
  
      if (!id) {
        response.status(404).send('ID is required')
        return
      }
  
      const SubjectExists = await SubjectRepository.findById(id)
  
      if (!SubjectExists) {
        response.status(400).send('Course not found')
        return
      }
  
      response.status(200).send(SubjectExists)
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async createSubject(request: Request, response: Response) {
    try {
      const { name, description } = request.body
  
      if (!name || !description) {
        response.status(404).send('Name and Description is required')
        return
      }
  
      const SubjectsExists = await SubjectRepository.findByName(name)
  
      if (SubjectsExists) {
        response.status(404).send(`The subject ${name} exists`)
        return
      }
  
      await SubjectRepository.create(name, description)
      response.status(201).send('Successfully created subject')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async updateSubjects(request: Request, response: Response) {
    try {
      const { id } = request.params
  
      if (!id) {
        response.status(404).send('ID is required')
        return
      }
  
      const { name, description } = request.body
  
      if (!name || !description) {
        response.status(404).send('Name and Description is required')
        return
      }
  
      const SubjectsExists = await SubjectRepository.findById(id)
  
      if (!SubjectsExists) {
        response.status(400).send('Subject not found')
        return
      }
  
      await SubjectRepository.update(id, name, description)
      response.status(200).send('Successfully updated subject')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async deleteSubject(request: Request, response: Response) {
    try {
      const { id } = request.params
  
      if (!id) {
        response.status(404).send('ID is required')
        return
      }
  
      const SubjectsExists = await SubjectRepository.findById(id)
  
      if (!SubjectsExists) {
        response.status(400).send('Subject not found')
        return
      }
  
      await SubjectRepository.delete(id)
      response.status(200).send('Successfully deleted subjects')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
}

export default new SubjectController()