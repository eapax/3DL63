'''
Code for L63 integration adapted from
https://gist.github.com/brews/37253ff1a31dc4525c5821f2436e39f0
'''

import numpy as np
from scipy.integrate import odeint, solve_ivp
import pandas as pd
from pathlib import Path

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
    tmax, n = 1000, 100000

    # Integrate
    print('Integrating L63 equations...')
    t = np.linspace(0, tmax, n)
    f = odeint(l63, (u0, v0, w0), t, args=(sigma, beta, rho))
    x, y, z = f.T

    # Make 'assets' folder to save data in
    cwd = str(Path(__file__).parent.parent.resolve())

    assets_dir = f'{cwd}/assets'
    Path(assets_dir).mkdir(exist_ok=True)
    print(f'Saving data in folder {assets_dir}')

    # Save output data as npy
    np.save(f'{assets_dir}/l63_point_cloud.npy', f, allow_pickle=True)

    # Save output data as csv
    df = pd.DataFrame({'x': x, 'y': y, 'z': z})
    df.to_csv(f'{assets_dir}/l63_point_cloud.csv')

    # Bin
    xvals = range(-20, 22, 1)
    yvals = range(-28, 30, 1)
    zvals = range(0, 52, 1)
    H, edges = np.histogramdd(f, bins=(xvals, yvals, zvals), density=True)

    # Loop over all bins and restructure histogram as list of nonempty bins
    hist = []
    thresh = 1e-21
    for i, x in enumerate(xvals[:-1]):
        for j, y in enumerate(yvals[:-1]):
            for k, z in enumerate(zvals[:-1]):
                p = H[i, j, k]
                if p > thresh:
                    hist.append([x, y, z, p])

    # Save histogram as npy
    np.save(f'{assets_dir}/l63_hist.npy', hist, allow_pickle=True)

    print('Script complete.')
