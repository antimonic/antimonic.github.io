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

Almost everything in this article is derived from [this Nvidia paper](https://research.nvidia.com/sites/default/files/pubs/2010-02_Efficient-Sparse-Voxel/laine2010tr1_paper.pdf).


# Octrees

Octrees are a common data structure which allows us to recursively divide 3D space.
We can think of our world space as a root node with 8 children, who themselves have 8 children, and so on as needed.
Its easiest to show visually:

The simplest way to represent 3D space with an octree is to build a full octree down to the spatial resolution we need. The depth of the tree is the 8th root of the number of voxels we want to represent. For a world with only 8 voxels, we need only a single layer octree, a single root with 8 octant children. Once we have a full tree, we can attach a single bit to each node which represents whether each voxel is on or off. This alone would allow us to approximate arbitrary geometry.

The structure of an octree allows us to cull children which do not add extra information. If all of a nodes children have the same state, we can remove the children and make that node a larger leaf node.

# Ray Tracing with Octrees

Once we have a data structure which represents the voxel space, we need an algorithm to take a ray and intersect it with the geometry.

## Box Intersection

Everything with raytracing against an octree boils down to intersecting against boxes. We can think of a box as three spaces between pairs of planes, one for each axis of the box.

<image>

We find the time *t* when the ray enters and exits each of these spaces. This gives us three pairs of (t_{min}) and

To check whether a ray intersects a box, we need to check against the plane containing each face of the box. Intersecting with an octree world is especially easy because each voxel is *axis-aligned*, meaning each face of the cube is perpendicular to the x,y, or z-axis. This means each plane is defined
