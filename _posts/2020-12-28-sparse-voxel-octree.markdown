---
layout: post
title:  "Voxel Game Engine - Sparse Voxel Octrees"
date:   2020-12-28 12:01:48 -0500
categories: graphics
desc: Voxel Octrees provide a method to render voxel worlds with ray tracing.
---
# A Voxel Engine

Allowing players direct control over the geometry of the world space is the ultimate goal of a sandbox game. Voxels provide an expensive but complete
solution by dividing up 3D space into discrete units and allowing the players to manipulate and interact with each unit. Minecraft is the greatest
implementation as of yet of a complete Voxel world, but the low spatial resolution (1 block \\(\approx\\) 1 cubic meter) and simple lighting and physics systems restricts
the gameplay potential of the engine.

This series will follow my attempt to build a voxel game engine in C++ using OpenGL which can do the following:
  - Operate at a much higher spatial resolution than Minecraft
  - Allow physics entities which can interact with the voxel environment without being locked to the voxel grid
  - Allow realtime lighting and shadows
  - Allow multiplayer
  - Allow arbitrary-size worlds with a reasonable memory footprint

Obviously I don't really expect to fulfill all of these goals but I think it will be more fun to aim for everything and look for a system which provides an
elegant general solution.

# Sparse Voxel Octrees

Almost everything in this article is derived from [this Nvidia paper](https://research.nvidia.com/sites/default/files/pubs/2010-02_Efficient-Sparse-Voxel/laine2010tr1_paper.pdf), but its a bit hard to parse for someone new to raytracing. The purpose of this article is to explain the math in the article and how I applied it to a voxel engine.


# Octrees

Octrees are a common data structure which allows us to recursively divide 3D space.
We can think of our world space as a root node with 8 children, who themselves have 8 children, and so on as needed.
Its easiest to show visually:

The simplest way to represent 3D space with an octree is to build a full octree down to the spatial resolution we need. The depth of the tree is the 8th root of the number of voxels we want to represent. For a world with only 8 voxels, we need only a single layer octree, a single root with 8 octant children. Once we have a full tree, we can attach a single bit to each node which represents whether each voxel is on or off. This alone would allow us to approximate arbitrary geometry.

The structure of an octree allows us to cull children which do not add extra information. If all of a nodes children have the same state, we can remove the children and make that node a larger leaf node. 

# Ray Tracing with Octrees

Once we have a data structure which represents the voxel space, we need an algorithm to take a ray and tell us whether or not we hit the geometry. Recall that ray tracing means shooting out a ray for each pixel on the screen. If, for each pixel, we know whether or not the geometry is in its line of sight, we can render the geometry.

We represent rays as a parameterized line, 
\\(r(t) = o + t * d\\)
where \\(o\\) is a 3D vector which represents the starting point of the ray, and \\(d\\) is a 3D vector which represents the direction of the ray. As \\(t\\) increases from 0, we travel along the ray away from the starting point in the direction \\(d\\).

## Box Intersection

Everything with raytracing against an octree boils down to intersecting against boxes. We can think of a box as the intersection of three spaces between pairs of planes, one for each axis of the box.

{% include image.html url="/assets/diagrams/planesdiag.png" description="Two of the pairs of planes which define the boundaries of a box. Planes in the same pair are colored the same. Paired planes are parallel, and we can think of the space between them as a plane with some thickness. The overlap of all three of these spaces is the box itself." %}


Using our parameterized form of the ray, we find the time *t* when the ray enters and exits each of these spaces; both should exist as long as the ray is not parallel to one of these planes (we'll address that later). This gives us three pairs of \\((t_{min},t_{max})\\) for the times during which the ray is passing through these spaces. If all three of these bands of times overlap at any point, we know there exists a point during which the ray was in all three spaces, meaning it was inside the box. We can check this by taking the largest \\(t_{min}\\) and checking if it is lower than the smallest \\(t_{max}\\).

The expense part of the math here is intersecting the ray with each of the 6 planes to get the six *t*'s. Each of these operations takes [multiple dot products](https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection), and
doing this for many boxes for each ray could get expensive. 

We can make intersecting the ray with each plane much easier by ensuring every voxel is *axis-aligned*, meaning each face of the cube is perpendicular to the x,y, or z-axis. This means that the equation for each plane is simply something like \\(x = 3\\), and we need only check when the ray crosses this point in the x-axis. This makes the equation for solving for *t* single dimensional and extremely cheap. 

## Octree Intersection

Intersecting with an octree is much similar, the only additional piece of information we need is which octant of the cube we hit. We can achieve this by also measuring the time at which the ray passes the center of each of the plane spaces, \\(t_{center}\\). 



This post will be added to and edited over time. Last updated: 1/8/21.
