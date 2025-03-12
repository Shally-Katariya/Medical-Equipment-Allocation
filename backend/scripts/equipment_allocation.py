import random
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
from scipy.spatial import distance_matrix

# Step 1: Generate random hospital locations
NUM_HOSPITALS = 10
hospital_names = [f"Hospital {i+1}" for i in range(NUM_HOSPITALS)]
locations = np.random.rand(NUM_HOSPITALS, 2) * 100  # Random 2D coordinates in a 100x100 grid

# Step 2: Compute distance matrix
dist_matrix = distance_matrix(locations, locations)

# Step 3: Construct a graph with hospitals as nodes
G = nx.Graph()

for i in range(NUM_HOSPITALS):
    for j in range(i + 1, NUM_HOSPITALS):
        distance = dist_matrix[i, j]
        G.add_edge(hospital_names[i], hospital_names[j], weight=distance)

# Step 4: Compute Minimum Spanning Tree (MST)
mst = nx.minimum_spanning_tree(G)

# Step 5: Visualization
plt.figure(figsize=(10, 7))
pos = {hospital_names[i]: locations[i] for i in range(NUM_HOSPITALS)}

# Draw all edges (original graph)
nx.draw(G, pos, with_labels=True, node_color='lightgray', edge_color='gray', alpha=0.3)

# Draw MST edges
nx.draw(mst, pos, with_labels=True, node_color='skyblue', edge_color='red', width=2)

# Annotate hospital names
for i, txt in enumerate(hospital_names):
    plt.annotate(txt, (locations[i][0], locations[i][1]), fontsize=10, ha='right')

plt.title("Optimized Medical Equipment Allocation (Minimum Spanning Tree)")
plt.show()

# Print optimized connections
print("Optimized Equipment Allocation Paths:")
for u, v, data in mst.edges(data=True):
    print(f"{u} ↔ {v} (Distance: {data['weight']:.2f})")
