import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deployer} = await getNamedAccounts();
	const {deploy} = deployments;


  const token = await deploy("TestToken",{
    from: deployer,
    log: true,
    autoMine: true
  });

  const dealClient = await deploy("DealClient",{
    from: deployer,
    log: true,
    autoMine: true
  });

  const dao = await deploy("DAO",{
    from: deployer,
    args: [token.address, dealClient.address],
    log: true,
    autoMine: true
  });

};

export default func;
func.tags=["Deploy"]