import type { Request, Response } from 'express'

import AccessLevelRepository from '../repositories/AccessLevelRepository'

class AccessLevelController {
  async findAll(_: Request, response: Response) {
    try {
      const allAccessLevel = await AccessLevelRepository.findAll()
  
      if (!allAccessLevel) {
        response.status(400).send('Access level not found')
        return
      }
  
      response.status(200).send(allAccessLevel)
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
  
      const accessExists = await AccessLevelRepository.findById(id)
  
      if (!accessExists) {
        response.status(400).send('Access level not found')
        return
      }
  
      response.status(200).send(accessExists)
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async createAccess(request: Request, response: Response) {
    try {
      const { type } = request.body
  
      if (!type) {
        response.status(404).send('TYPE is required')
        return
      }
  
      const typeExists = await AccessLevelRepository.findByType(type)
  
      if (typeExists) {
        response.status(404).send(`The type ${type} exists`)
        return
      }
  
      await AccessLevelRepository.createAccess(type)
      response.status(201).send('Access level created')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async updateAccess(request: Request, response: Response) {
    try {
      const { id } = request.params
      const { type } = request.body
  
      if (!id) {
        response.status(404).send('ID is required')
        return
      }
  
      if (!type) {
        response.status(404).send('TYPE is required')
        return
      }
  
      await AccessLevelRepository.updateAccess(id, type)
      response.status(200).send('Accesss level updated')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
  
  async deleteAccess(request: Request, response: Response) {
    try {
      const { id } = request.params
  
      if (!id) {
        response.status(404).send('ID is required')
        return
      }
  
      const accessExists = await AccessLevelRepository.findById(id)
  
      if (!accessExists) {
        response.status(400).send('Access level not found')
        return
      }
  
      await AccessLevelRepository.deleteAccess(id)
      response.status(200).send('Access level deleted')
    } catch (error) {
      console.log(error)
      response.status(500).send('Internal server error')
    }
  }
}

export default new AccessLevelController()