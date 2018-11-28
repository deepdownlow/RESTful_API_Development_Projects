const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const router = express.Router()

const Profile = require('../../models/Profile')
const User = require('../../models/User')

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
 const { id } = req.user
 Profile.findOne({user: id})
  .populate('user', ['name', 'avatar'])
  .then(profile => {
   if(!profile) {
    res.status(404).json({error: 'user not found'})
   }
   res.json(profile)
  })
  .catch(err => res.status(400).json(err))
})
router.get('/all', (req, res) => {
 Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
   if(!profiles) res.status(404).json({noProfiles:`Unfortunately, my idea has turn out to be a disaster since noone's signed up `})
   res.json(profiles)
  })
  .catch(err => res.status(500).json(err))
})
router.get('/handle/:handle', (req, res) => {
 const errors = {}
 const { handle } = req.params
 Profile.findOne({ handle })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
   if(!profile) {
    errors.noProfile = `No profile found`
    res.status(404).json(errors)
   }
   res.json(profile)
  })
  .catch(err => res.status(404).json(err))
})
router.get('/user/:user_id', (req, res) => {
 const errors = {}
 const { user_id } = req.params
 Profile.findOne({ user: user_id })
  .populate('user', ['name','avatar'])
  .then(profile => {
   if(!profile) {
    res.status(404).json({error:`User doesn't exist`})
   }
   res.json(profile)
  })
  .catch(err => res.status(404).json({profile: `Can't find the profile you are looking for`}))
})
router.post('/', passport.authenticate('jwt',{ session: false }), (req, res) => {
 const { company, 
         handle, 
         location, 
         website, 
         bio, 
         status, 
         githubusername, 
         skills, 
         youtube,
         insta,
         facebook,
         linkedin,
         twitter,
          } = req.body
 const newProfile = {}
 newProfile.user = req.user
 if(company) newProfile.company = company
 if(handle) newProfile.handle = handle
 if(location) newProfile.location = location
 if(website) newProfile.website = website
 if(bio) newProfile.bio = bio
 if(status) newProfile.status = status
 if(githubusername) newProfile.githubusername = githubusername
 if(typeof skills !== 'undefined') newProfile.skills = skills.split(',')
 newProfile.social = {}
 if (youtube) newProfile.social.youtube = youtube
 if (twitter) newProfile.social.twitter = twitter
 if (insta) newProfile.social.insta = insta
 if (linkedin) newProfile.social.linkedin = linkedin
 if (facebook) newProfile.social.facebook = facebook

 Profile.findOne({ user: req.user.id })
  .then(profile => {
   if(profile) {
    Profile.findOneAndUpdate({ user: req.user.id }, { $set: newProfile }, { new: true })
     .then(profile => res.json(profile))
   } else {
    Profile.findOne({ handle: newProfile.handle })
     .then(profile => {
      if(profile) {
       screen.status(400).json({error:`username already exists`})
      }
      new Profile(newProfile).save()
       .then(profile => res.json(profile))
     })
     .catch(err => console.log(err))
   }
  })
  .catch(err => console.log(err))
})
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
 const { id } = req.user
 const { 
        title, 
        company, 
        location, 
        from, 
        to, 
        current, 
        description } = req.body

 Profile.findOne({ user: id })
  .then(profile => {
   const experience = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
   }
   profile.experience.unshift(experience)
   profile.save()
    .then(profile => res.json(profile))
    .catch(err => console.log(err))
  })
  .catch(err => res.json(err))
})
router.delete('/experience/:experience_id', passport.authenticate('jwt', { session: false }), (req, res) => {
 const { id } = req.user
 const { experience_id} = req.params
 Profile.findOne({ user: id })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
   const itemIndex = profile.experience.map(exp => exp.id).indexOf(experience_id)
   profile.experience.splice(itemIndex, 1)
   profile.save()
    .then(profile => res.json(profile))
    .catch(err => res.status(500).json(err))
  })
  .catch(err => console.log(err))
})
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
 const { id } = req.user
 const { 
         school, 
         degree, 
         field, 
         from, 
         to } = req.body

 Profile.findOne({ user: id })
  .then(profile => {
   const education = {
    school,
    degree,
    field,
    from,
    to
   }
   profile.education.unshift(education)
   profile.save()
    .then(profile => res.json(profile))
    .catch(err => res.status(500).json(err))
  })
  .catch(err => console.log(err))
})
router.delete('/education/:education_id', passport.authenticate('jwt', { session: false }), (req, res) => {
 const { id } = req.user
 const { education_id } = req.params
 Profile.findOne({ user: id })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
   const itemIndex = profile.education.map(edu => edu.id).indexOf(education_id)
   profile.education.splice(itemIndex, 1)
   profile.save()
    .then(profile => res.json(profile))
    .catch(err => res.status(500).json(err))
  })
  .catch(err => console.log(err))
})
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
 const { id } = req.user
 Profile.findOneAndRemove({ user: id })
  .then(() => {
   User.findOneAndRemove({ _id: id })
    .then(() => res.json({ success: true }))
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
})

module.exports = router