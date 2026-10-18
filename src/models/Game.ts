import {Color3, Engine} from '@babylonjs/core'
import Scene from './scene/Scene'
import store from '@/store/store'
import storeVuex from '@/store/vuex'
import Audio from '@/models/sounds/Audio'
import ServerClient from './ServerClient'
import PlayerSelf from '@/models/playerSelf/Player'
import Player from '@/models/player/Player'
import { v4 as uuidv4 } from 'uuid'
import RegisterTagsExtension from '@/models/scene/TagsExtansion'
import Collisions from '@/models/mehanics/Collisions'
import Canvas from "@/models/scene/Canvas";
import Points from '@/models/mehanics/Points'
import Finish from "@/models/mehanics/Finish"
import DevMode from "@/models/scene/DevMode"
import Savepoint from "@/models/mehanics/Savepoint"
import BlendModes from '@/models/scene/BlendModes'
import Materials from "@/models/scene/Materials"
import OutLiner from "@/models/scene/OutLiner"
import Doors from '@/models/mehanics/Doors'
import Prefabs from '@/models/scene/Prefabs'
import Optimize from '@/models/scene/Optimize'
import addSchoolCourtyard from '@/models/school/Courtyard'

export default class Game {
  
  init () {
    const playerId = this.getPlayerId()
    const skinColor = Color3.Random()
    store.setPlayerId(playerId)
    store.addPlayer(playerId, skinColor)
    
    globalThis.assetContainers = []
    const canvas = Canvas.setCanvas()
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true })
    const sceneModel = new Scene(engine)
    const prototypeEnabled = new URLSearchParams(window.location.search).get('schoolPrototype') === '1'
    if (prototypeEnabled) {
      const indicator = document.createElement('div')
      indicator.id = 'school-prototype-status'
      indicator.setAttribute('data-school-build', 'courtyard-v2')
      indicator.style.cssText = 'position:fixed;top:12px;right:12px;z-index:2147483647;background:#123d43;color:white;padding:10px 14px;border:2px solid #ffd166;border-radius:6px;font:600 14px Arial,sans-serif;pointer-events:none'
      indicator.textContent = 'SCHOOL SAGA • courtyard-v2 • loading'
      document.body.appendChild(indicator)
      console.info('[School Saga] courtyard-v2 prototype enabled')
    }
    
    sceneModel.load(async () => {
      new Audio()
      sceneModel.setEnvironment()

      this.setClassesGame(() => {
        PlayerSelf.init(() => {
          if (prototypeEnabled) {
            const indicator = document.getElementById('school-prototype-status')
            try {
              addSchoolCourtyard()
              const count = globalThis.scene.meshes.filter(mesh => mesh.name.startsWith('school_') || mesh.name.startsWith('courtyard_')).length
              if (indicator) indicator.textContent = 'SCHOOL SAGA • courtyard-v2 • ' + count + ' meshes'
              console.info('[School Saga] courtyard-v2 mesh count:', count)
            } catch (error) {
              if (indicator) indicator.textContent = 'SCHOOL SAGA • courtyard-v2 • ERROR'
              console.error('[School Saga] courtyard prototype failed:', error)
            }
          }
          // Single-player by default; enable Lola multiplayer explicitly.
          if (process.env.VUE_APP_MULTIPLAYER_ENABLED === 'true') {
            const serverClient = new ServerClient(playerId)
            serverClient.init()
          }

          store.subscribeAddPlayer((playerId: string) => {
            new Player(playerId)
          })

          Finish.setDetector(playerId)
          new Points(playerId)

          storeVuex.commit('LOADING_TOGGLE')
        })
      })
    })
  }
  
 setClassesGame (callback: any) {
    RegisterTagsExtension()

    new DevMode()
    globalThis.collisions = new Collisions()
    callback()
    Savepoint.init()
    Materials.addCustomMaterial()
    BlendModes.init()
    OutLiner.init()
    new Doors()

   new Prefabs(() => {
      //Optimize.setMeshes(globalThis.scene.meshes)
    })
  }
  
  getPlayerId () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    let playerId = urlParams.get('playerId')
    
    if (!playerId) {
      playerId = 'guest_' + uuidv4()
    }
    
    return playerId
  }
}