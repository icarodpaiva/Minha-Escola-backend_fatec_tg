import CoursesRepository from "../repositories/CoursesRepository";

import type { Request, Response } from 'express'

class CoursesController {
  async findAll(_: Request, response: Response) {
    try {
      const Courses = await CoursesRepository.findAll()
  
      if (!Courses) {
        response.status(400).send('Courses not found')
        return
      }
  
      response.status(200).send(Courses)
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
  
      const CourseExists = await CoursesRepository.findById(id)
  
      if (!CourseExists) {
        response.status(400).send('Course not found')
        return
      }
  
      response.status(200).send(CourseExists)
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async createCourses(request: Request, response: Response) {
    try {
      const { name, description } = request.body
  
      if (!name || !description) {
        response.status(404).send('Name and Description is required')
        return
      }
  
      const CoursesExists = await CoursesRepository.findByName(name)
  
      if (CoursesExists) {
        response.status(404).send(`The course ${name} exists`)
        return
      }
  
      await CoursesRepository.create(name, description)
      response.status(201).send('Successfully created courses')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async updateCourses(request: Request, response: Response) {
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
  
      const CourseExists = await CoursesRepository.findById(id)
  
      if (!CourseExists) {
        response.status(400).send('Course not found')
        return
      }
  
      await CoursesRepository.update(id, name, description)
      response.status(200).send('Successfully updated courses')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async deleteCourses(request: Request, response: Response) {
    try {
      const { id } = request.params
  
      if (!id) {
        response.status(404).send('ID is required')
        return
      }
  
      const CourseExists = await CoursesRepository.findById(id)
  
      if (!CourseExists) {
        response.status(400).send('Course not found')
        return
      }
  
      await CoursesRepository.delete(id)
      response.status(200).send('Successfully deleted courses')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
}

export default new CoursesController()