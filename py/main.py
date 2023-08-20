'''
Code for L63 integration adapted from 
https://gist.github.com/brews/37253ff1a31dc4525c5821f2436e39f0
'''

import numpy as np
from scipy.integrate import odeint, solve_ivp
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import pandas as pd

def l63(x, t, sigma, beta, rho):
    """
    The Lorenz63 equations
    """
    u, v, w = x
    up = - sigma * (u - v)
    vp = rho * u - v - u * w
    wp = - beta * w + u * v
    return up, vp, wp

if __name__=='__main__':
    
    # Lorenz paramters and initial conditions
    sigma, beta, rho = 10, 2.667, 28
    u0, v0, w0 = 0, 1, 1.05
    
    # Maximum time point and total number of time points
    tmax, n = 100, 10000
    
    # Integrate
    t = np.linspace(0, tmax, n)
    f = odeint(l63, (u0, v0, w0), t, args=(sigma, beta, rho))
    x, y, z = f.T
    
    # Save output data
    df = pd.DataFrame({
        'x': x,
        'y': y,
        'z': z,
    })
    df.to_csv('../data/l63_point_cloud.csv')
    
    # Bin
    bins = 10
    H, edges = np.histogramdd(f, bins=bins, density=True) 
    
    # Save binned data
    np.save(f'../data/l63_binned_densities_{bins}bins_.npy', H, allow_pickle=True)
    np.save(f'../data/l63_binned_edges_{bins}bins.npy', edges, allow_pickle=True)
    

