---
layout: post
title:  "A Simple Approach to Active Ragdolls In Unity"
date:   2021-1-15 1:02:20 -0500
categories: gametech
desc: Active Ragdolls are a pretty great way to create procedural motion or to make animations silly and exciting.
---

# Passive vs Active Ragdolls

A passive ragdoll is one that is not being applied any extra forces by the player. It is simply a skeleton (a hierarchy of empty transforms) connected with physics joints which use forces to keep bones together and constrain the joint rotations in a realistic way (i.e., an elbow should not bend all the way backwards). 

An active ragdoll is a passive ragdoll that has additional forces being applied to it by the game in order to achieve some visual or gameplay effect. This could be anything from simply keeping the skeleton uprightto using muscular forces to match a skeleton to an animation. In order to construct an active ragdoll, it is necessary first to have a decent passive ragdoll.

## Building a Ragdoll in Unity

Unity has a built-in [Ragdoll Wizard](https://docs.unity3d.com/Manual/wizard-RagdollWizard.html) which will take any humanoid skeleton and build a reasonable ragdoll out of it. I recommend using this as a starting point, but the output of this is rarely perfect and you'll probably need to spend time adjusting the collider sizes and angular limits until you get the type of ragdoll you want. You can also increase the mass of limbs to make their motion a bit slower and more realistic. 

If your ragdoll is not humanoid, you aren't that far behind. For each joint that you want to have motion, add a rigidbody, collider, and character joint. Keep in mind that this does not need to be every single bone! Each finger probably does not need its own physics and following its parents forward kinematics will be good enough. For the humanoid model, there are only two joints for each limb, two for the spine, and one for the head. Set the 'Connected Body' field for the joint to the rigidboy it should be connected to, this is similar to parenting and usually the connected rigidbody lives on a parent.

## The Easiest Way

Now that we have a passive ragdoll, we can start with the simplest type of ragdolls which involve simply keeping the skeleton upright and dragging the rest of the limbs with them. For humanoid skeletons, this usually means appling a force and a torque to the pelvis bone (the root of both the skeleton and the physics joints), and letting physics handle the rest of the motion.
